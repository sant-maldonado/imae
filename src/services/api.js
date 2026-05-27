import { supabase } from '../lib/supabase'

export async function fetchPerfil() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) throw error
  return data
}

export async function fetchEquipos() {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchEquipo(id) {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function fetchTecnicos() {
  const { data, error } = await supabase
    .from('tecnicos')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchTecnico(id) {
  const { data, error } = await supabase
    .from('tecnicos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function fetchOrdenes() {
  const { data, error } = await supabase
    .from('ordenes')
    .select('*, equipos!equipoId(nombre), tecnicos!tecnicoId(nombre)')
    .order('id', { ascending: false })
  if (error) throw error
  return data.map((o) => ({
    ...o,
    equipoNombre: o.equipos?.nombre,
    tecnicoNombre: o.tecnicos?.nombre,
  }))
}

export async function fetchOrden(id) {
  const { data, error } = await supabase
    .from('ordenes')
    .select('*, equipos!equipoId(nombre), tecnicos!tecnicoId(nombre)')
    .eq('id', id)
    .single()
  if (error) throw error
  return { ...data, equipoNombre: data.equipos?.nombre, tecnicoNombre: data.tecnicos?.nombre }
}

export async function createOrden(data) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: result, error } = await supabase
    .from('ordenes')
    .insert({ ...data, created_by: user.id })
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updateOrden(id, data) {
  const { error } = await supabase
    .from('ordenes')
    .update(data)
    .eq('id', id)
  if (error) throw error
  return { id, ...data }
}

export async function deleteOrden(id) {
  const { error } = await supabase
    .from('ordenes')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

export async function fetchCompras() {
  const { data, error } = await supabase
    .from('compras')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchCompra(id) {
  const { data, error } = await supabase
    .from('compras')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCompra(data) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: result, error } = await supabase
    .from('compras')
    .insert({ ...data, created_by: user.id })
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updateCompra(id, data) {
  const { error } = await supabase
    .from('compras')
    .update(data)
    .eq('id', id)
  if (error) throw error
  return { id, ...data }
}

export async function deleteCompra(id) {
  const { error } = await supabase
    .from('compras')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

export async function fetchDashboardStats() {
  const { data: ordenes } = await supabase.from('ordenes').select('*')
  const { data: equipos } = await supabase.from('equipos').select('*')
  const { data: tecnicos } = await supabase.from('tecnicos').select('*').eq('activo', true)

  const total = ordenes?.length || 0
  const pendientes = ordenes?.filter((o) => o.estado === 'pendiente').length || 0
  const enProgreso = ordenes?.filter((o) => o.estado === 'en_progreso').length || 0
  const completadas = ordenes?.filter((o) => o.estado === 'completada').length || 0
  const urgentes = ordenes?.filter((o) => o.prioridad === 'urgente' && o.estado !== 'completada').length || 0
  const equiposOperativos = equipos?.filter((e) => e.estado === 'operativo').length || 0
  const equiposAveriados = equipos?.filter((e) => e.estado === 'averiado').length || 0

  const ordenesPorMes = Array.from({ length: 6 }, (_, i) => {
    const mes = new Date()
    mes.setMonth(mes.getMonth() - (5 - i))
    const mesStr = mes.toLocaleString('es', { month: 'short' })
    const count = ordenes?.filter((o) => {
      const fecha = new Date(o.fechaCreacion)
      return fecha.getMonth() === mes.getMonth() && fecha.getFullYear() === mes.getFullYear()
    }).length || 0
    return { mes: mesStr, completadas: Math.floor(count * 0.6), pendientes: count }
  })

  return {
    total,
    pendientes,
    enProgreso,
    completadas,
    urgentes,
    equiposOperativos,
    equiposAveriados,
    totalEquipos: equipos?.length || 0,
    totalTecnicos: tecnicos?.length || 0,
    ordenesPorMes,
  }
}
