SISTEMA DE LOGIN Y PERMISOS - GUIA COMPLETA
=============================================
Proyecto: Control de Mantenimiento Fabril (React + Supabase)
=============================================================

ARQUITECTURA GENERAL
--------------------

  React App (Frontend)
  +-----------------------------+
  | AuthContext (estado global) |
  | ProtectedRoute (guarda)     |
  | Login (pagina)              |
  | supabase.js (cliente)       |
  +----------+------------------+
             |
             | API calls con JWT anon key
             v
  Supabase (Backend como servicio)
  +-----------------------------+
  | Supabase Auth (email/pass)  |
  | PostgreSQL + RLS            |
  | - perfiles (roles)          |
  | - equipos, ordenes, etc     |
  +-----------------------------+

No hay backend propio. Todo pasa por el cliente supabase-js
directo al proyecto Supabase. La seguridad se maneja con:
  1) Supabase Auth (login, registro, sesion)
  2) Row Level Security (RLS) en la base de datos
  3) Trigger que crea el perfil automaticamente


PASO 1: CREAR PROYECTO SUPABASE
--------------------------------

1. Ir a https://supabase.com y crear un proyecto nuevo
2. Copiar los datos de conexion:
   - Project URL: https://XXXXXX.supabase.co
   - anon public key: eyJhbGciOiJ... (la key "anon", no la "service_role")

3. Configurar Authentication > Settings:
   - DISABLE "Confirm email" si queres registro directo sin confirmacion
     (en produccion, deja activado el email confirmation)
   - Session duration: default 3600 (1 hora)


PASO 2: CLIENTE SUPABASE EN REACT
----------------------------------

Archivo: src/lib/supabase.js

  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = 'https://XXXXXX.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJ...' // anon key

  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { detectSessionInUrl: false },
  })

- NO uses la service_role key (tiene full acceso, es peligrosa en el frontend)
- NO borres localStorage al cargar el modulo (eso mata la sesion)
- detectSessionInUrl: false evita problemas con el hash de login


PASO 3: TABLA DE PERFILES + TRIGGER
-------------------------------------

Se necesita una tabla public.perfiles que guarde el rol de cada usuario.
Se vincula con auth.users (la tabla interna de Supabase Auth).

SQL a ejecutar en Supabase SQL Editor:

  -- TABLA DE PERFILES
  CREATE TABLE IF NOT EXISTS public.perfiles (
    id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email    TEXT NOT NULL,
    nombre   TEXT NOT NULL,
    rol      TEXT NOT NULL DEFAULT 'tecnico'
             CHECK (rol IN ('admin', 'supervisor', 'tecnico', 'operador')),
    activo   BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- TRIGGER: crea perfil automaticamente al registrarse
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = ''
  AS $$
  BEGIN
    INSERT INTO public.perfiles (id, email, nombre, rol)
    VALUES (
      NEW.id,
      NEW.email,
      COLAESCE(NEW.raw_user_meta_data ->> 'nombre', split_part(NEW.email, '@', 1)),
      'tecnico'
    );
    RETURN NEW;
  END;
  $$;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

Puntos clave:
- El trigger se ejecuta DESPUES de crear el usuario en auth.users
- Toma el nombre de raw_user_meta_data (enviado desde el form de registro)
- Si no hay nombre, usa la parte antes del @ del email
- El rol por defecto es 'tecnico' (el mas restrictivo)
- Si necesitas admin, lo cambias manualmente en la BD
- NO uses BEFORE INSERT porque el trigger necesita el NEW.id ya generado


PASO 4: ROW LEVEL SECURITY (RLS)
---------------------------------

RLS es el firewall a nivel de base de datos. Cada query que llega
verifica si el usuario autenticado tiene permiso.

Conceptos:
- auth.role() = 'authenticated'  -> cualquier usuario logueado
- auth.uid()                     -> el UUID del usuario actual
- Cada tabla tiene sus propias POLICIES para SELECT, INSERT, UPDATE, DELETE

Esquema de roles:

  admin      -> puede todo (CRUD completo en todas las tablas)
  supervisor -> puede leer todo, crear/editar datos de negocio
  tecnico    -> puede leer todo, editar SOLO sus propias ordenes
  operador   -> solo lectura (en este proyecto no se implemento)

Ejemplo: policies para la tabla ordenes

  -- Todos los autenticados pueden VER ordenes
  CREATE POLICY ordenes_select ON public.ordenes
    FOR SELECT USING (auth.role() = 'authenticated');

  -- Solo admin/supervisor pueden CREAR
  CREATE POLICY ordenes_insert ON public.ordenes
    FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.perfiles
        WHERE id = auth.uid() AND rol IN ('admin', 'supervisor'))
    );

  -- Admin, supervisor, o el creador pueden EDITAR
  CREATE POLICY ordenes_update ON public.ordenes
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.perfiles
        WHERE id = auth.uid() AND rol IN ('admin', 'supervisor'))
      OR created_by = auth.uid()
    );

  -- Solo admin puede BORRAR
  CREATE POLICY ordenes_delete ON public.ordenes
    FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.perfiles
        WHERE id = auth.uid() AND rol = 'admin')
    );

Pattern general para todas las tablas:
- SELECT: auth.role() = 'authenticated' (todos ven todo)
- INSERT: EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'supervisor'))
- UPDATE: igual que INSERT, a veces con OR created_by = auth.uid()
- DELETE: solo admin

NO OLVIDES activar RLS en cada tabla:

  ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
  -- etc...


PASO 5: AUTH CONTEXT (React)
-----------------------------

Archivo: src/context/AuthContext.jsx

Es el estado global del usuario. Provee:
- user: el objeto de Supabase Auth (id, email)
- perfil: el registro de public.perfiles (nombre, rol)
- loading: true mientras se verifica la sesion
- login(email, password): inicia sesion
- register(email, password, nombre): crea cuenta nueva
- logout(): cierra sesion

Estructura:

  const AuthContext = createContext(null)

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [perfil, setPerfil] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // Verificar si hay sesion activa al cargar la app
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          // Cargar el perfil (nombre, rol) desde la BD
          supabase.from('perfiles').select('*')
            .eq('id', session.user.id).single()
            .then(({ data }) => setPerfil(data))
            .catch(() => setPerfil(null))
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
      const { data: perfilData } = await supabase
        .from('perfiles').select('*').eq('id', data.user.id).single()
      setPerfil(perfilData)
    }

    const register = async (email, password, nombre) => {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { nombre } },
      })
      if (error) throw error
    }

    const logout = async () => {
      await supabase.auth.signOut()
      setUser(null)
      setPerfil(null)
    }

    return (
      <AuthContext.Provider value={{ user, perfil, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  export const useAuth = () => useContext(AuthContext)


PASO 6: WRAP EAR EN EL ROOT
-----------------------------

Archivo: src/App.jsx

  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { AuthProvider } from './context/AuthContext'
  import AppRouter from './routes/AppRouter'

  const queryClient = new QueryClient()

  export default function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    )
  }

Orden IMPORTANTE: AuthProvider debe estar DENTRO de QueryClientProvider
pero FUERA de BrowserRouter para que toda la app tenga acceso al usuario.


PASO 7: PROTECTED ROUTE
-------------------------

Archivo: src/routes/ProtectedRoute.jsx

Redirige a /login si el usuario no esta autenticado.
Mientras se verifica la sesion, muestra "Cargando...".

  import { Navigate } from 'react-router-dom'
  import { useAuth } from '../context/AuthContext'

  export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return <div>Cargando...</div>
    if (!user) return <Navigate to="/login" replace />

    return children
  }

Uso en el router (AppRouter.jsx):

  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ordenes" element={<WorkOrders />} />
      ... todas las rutas protegidas adentro ...
    </Route>
  </Routes>

El truco: ProtectedRoute envuelve a Layout, y todas las rutas hijas
de Layout heredan la proteccion. La ruta /login queda FUERA.


PASO 8: PAGINA DE LOGIN
-------------------------

Archivo: src/pages/Login.jsx

Componente con:
- Formulario de email + password
- Toggle entre Login y Registro
- Manejo de errores (credenciales invalidas, etc)
- Si es registro, pide nombre y usa signUp()
- Si es login, usa signInWithPassword() y redirige a /

Flujo:
  1. Usuario ingresa email + password
  2. login() llama a supabase.auth.signInWithPassword()
  3. Supabase valida credenciales, devuelve session
  4. AuthContext actualiza user + perfil
  5. Login redirige a '/' con navigate('/')
  6. ProtectedRoute ve que user existe, renderiza Layout


PASO 9: USAR EL PERFIL EN EL RESTO DE LA APP
----------------------------------------------

Para acceder al usuario y su rol desde cualquier componente:

  import { useAuth } from '../context/AuthContext'

  function MiComponente() {
    const { user, perfil } = useAuth()

    // user.id    -> UUID del usuario autenticado
    // user.email -> email
    // perfil.rol -> 'admin', 'supervisor', 'tecnico', 'operador'
    // perfil.nombre -> nombre para mostrar
  }

Ejemplo: mostrar/ocultar boton segun rol

  const { perfil } = useAuth()
  const esAdmin = perfil?.rol === 'admin'

  {esAdmin && <button onClick={eliminar}>Eliminar</button>}

Ejemplo: filtrar datos por usuario

  // En las consultas SQL (via RLS, automatico)
  // O en el frontend:
  supabase.from('ordenes').select('*').eq('created_by', user.id)


PASO 10: BUENAS PRACTICAS Y TRAMPAS EVITADAS
----------------------------------------------

1. USAR SIEMPRE la anon key, NUNCA la service_role key en el frontend

2. NO import.meta.env para la key si deployas en Netlify
   (Netlify sobreescribe las ENV vars del build con las suyas).
   Hardcodeala directamente en el codigo o usa un config.js aparte.

3. NO borres localStorage al importar supabase.js
   Eso mata la sesion en cada recarga de pagina.

4. CUIDADO con la version de @supabase/supabase-js
   - v2.106.2 tiene un bug de reentrancy lock en onAuthStateChange
     que traba getSession(). Usar v2.39.0 o similar.
   - postgrest-js v1.8.0 NO convierte camelCase automaticamente.
     Las columnas en la BD deben llamarse con snake_case
     (ej: fecha_creacion en vez de fechaCreacion) para que
     postgrest-js las convierta a fechaCreacion en JS.

5. NOMBRES DE COLUMNAS en la BD:
   Usa snake_case siempre. PostgreSQL convierte los nombres
   sin comillas a minusculas. Ej:
   - fechaCreacion -> fechacreacion (no sirve)
   - fecha_creacion -> fecha_creacion -> JS: fechaCreacion (bien)

6. El trigger on_auth_user_created usa NEW.raw_user_meta_data
   que se pasa desde el frontend como options: { data: { nombre } }
   en signUp().

7. Para cambiar el rol de un usuario, ejecutar en SQL Editor:
   UPDATE public.perfiles SET rol = 'admin' WHERE email = 'user@email.com';

8. La sesion la maneja Supabase Auth automaticamente:
   - Al loguearse, guarda tokens en localStorage
   - Los envia en cada request como Bearer token
   - RLS verifica el token en cada consulta
   - Al hacer logout, borra los tokens locales


RESUMEN DEL FLUJO COMPLETO
--------------------------

1. Usuario visita la app
2. AuthContext.getSession() verifica si hay sesion activa
3. Si NO hay sesion -> ProtectedRoute redirige a /login
4. Usuario se loguea o registra
5. Supabase Auth valida credenciales, devuelve session
6. Trigger SQL crea perfil automaticamente (si es registro)
7. AuthContext guarda user + perfil en estado
8. ProtectedRoute deja pasar a las rutas protegidas
9. Cada componente usa useAuth() para saber el rol
10. Cada consulta a la BD pasa por RLS que verifica permisos
