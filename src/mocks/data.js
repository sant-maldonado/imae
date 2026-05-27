export const equipos = [
  { id: 1, nombre: 'Torno CNC', codigo: 'TNC-001', ubicacion: 'Nave A - Sección 1', estado: 'operativo', ultimoMantenimiento: '2026-04-15', proximoMantenimiento: '2026-07-15' },
  { id: 2, nombre: 'Fresadora Universal', codigo: 'FRU-002', ubicacion: 'Nave A - Sección 2', estado: 'operativo', ultimoMantenimiento: '2026-05-10', proximoMantenimiento: '2026-08-10' },
  { id: 3, nombre: 'Prensa Hidráulica', codigo: 'PRH-003', ubicacion: 'Nave B', estado: 'averiado', ultimoMantenimiento: '2026-03-20', proximoMantenimiento: '2026-06-20' },
  { id: 4, nombre: 'Compresor Industrial', codigo: 'CIN-004', ubicacion: 'Planta Baja', estado: 'operativo', ultimoMantenimiento: '2026-05-01', proximoMantenimiento: '2026-08-01' },
  { id: 5, nombre: 'Caldera Vapor', codigo: 'CAV-005', ubicacion: 'Planta Alta', estado: 'mantenimiento', ultimoMantenimiento: '2026-02-10', proximoMantenimiento: '2026-05-10' },
  { id: 6, nombre: 'Robot Soldador', codigo: 'RSO-006', ubicacion: 'Nave C', estado: 'operativo', ultimoMantenimiento: '2026-04-28', proximoMantenimiento: '2026-07-28' },
  { id: 7, nombre: 'Cinta Transportadora', codigo: 'CTR-007', ubicacion: 'Nave A - Sección 3', estado: 'operativo', ultimoMantenimiento: '2026-05-05', proximoMantenimiento: '2026-08-05' },
  { id: 8, nombre: 'Sistema HVAC', codigo: 'SHV-008', ubicacion: 'Edificio Central', estado: 'operativo', ultimoMantenimiento: '2026-03-01', proximoMantenimiento: '2026-06-01' },
  { id: 9, nombre: 'Taladro Radial', codigo: 'TRA-009', ubicacion: 'Nave A - Sección 1', estado: 'operativo', ultimoMantenimiento: '2026-05-20', proximoMantenimiento: '2026-08-20' },
  { id: 10, nombre: 'Esmeril Angular', codigo: 'EAN-010', ubicacion: 'Taller', estado: 'averiado', ultimoMantenimiento: '2026-01-15', proximoMantenimiento: '2026-04-15' },
  { id: 11, nombre: 'Inyectora Plástico', codigo: 'IPL-011', ubicacion: 'Nave D', estado: 'operativo', ultimoMantenimiento: '2026-04-01', proximoMantenimiento: '2026-07-01' },
  { id: 12, nombre: 'Grua Puente', codigo: 'GPU-012', ubicacion: 'Nave A', estado: 'operativo', ultimoMantenimiento: '2026-05-15', proximoMantenimiento: '2026-08-15' },
]

export const tecnicos = [
  { id: 1, nombre: 'Carlos López', especialidad: 'Mecánico Industrial', telefono: '555-0101', email: 'carlos@fabrica.com', activo: true },
  { id: 2, nombre: 'María García', especialidad: 'Eléctrica', telefono: '555-0102', email: 'maria@fabrica.com', activo: true },
  { id: 3, nombre: 'Juan Pérez', especialidad: 'Soldador', telefono: '555-0103', email: 'juan@fabrica.com', activo: true },
  { id: 4, nombre: 'Ana Martínez', especialidad: 'Instrumentista', telefono: '555-0104', email: 'ana@fabrica.com', activo: true },
  { id: 5, nombre: 'Roberto Sánchez', especialidad: 'Mecánico de Precisión', telefono: '555-0105', email: 'roberto@fabrica.com', activo: false },
  { id: 6, nombre: 'Laura Fernández', especialidad: 'Electrónica', telefono: '555-0106', email: 'laura@fabrica.com', activo: true },
  { id: 7, nombre: 'Diego Ramírez', especialidad: 'Hidráulica', telefono: '555-0107', email: 'diego@fabrica.com', activo: true },
]

export const ordenes = [
  { id: 1, equipoId: 1, tecnicoId: 1, titulo: 'Cambio de aceite hidráulico', descripcion: 'Realizar cambio de aceite hidráulico del sistema de lubricación del torno CNC.', prioridad: 'alta', estado: 'pendiente', fechaCreacion: '2026-05-20', fechaProgramada: '2026-05-25', fechaCompletada: null, tipoMantenimiento: 'preventivo' },
  { id: 2, equipoId: 2, tecnicoId: 2, titulo: 'Revisión eléctrica de fresadora', descripcion: 'Verificar conexiones eléctricas y tablero de control de la fresadora universal.', prioridad: 'media', estado: 'en_progreso', fechaCreacion: '2026-05-18', fechaProgramada: '2026-05-22', fechaCompletada: null, tipoMantenimiento: 'correctivo' },
  { id: 3, equipoId: 3, tecnicoId: 7, titulo: 'Reparación de fuga hidráulica', descripcion: 'Localizar y reparar fuga en el sistema hidráulico de la prensa.', prioridad: 'urgente', estado: 'pendiente', fechaCreacion: '2026-05-22', fechaProgramada: '2026-05-23', fechaCompletada: null, tipoMantenimiento: 'correctivo' },
  { id: 4, equipoId: 5, tecnicoId: 1, titulo: 'Limpieza de quemadores', descripcion: 'Limpieza general de quemadores y revisión de válvulas de la caldera.', prioridad: 'media', estado: 'completada', fechaCreacion: '2026-05-10', fechaProgramada: '2026-05-12', fechaCompletada: '2026-05-12', tipoMantenimiento: 'preventivo' },
  { id: 5, equipoId: 4, tecnicoId: 2, titulo: 'Cambio de filtros de aire', descripcion: 'Reemplazar filtros de aire del compresor industrial.', prioridad: 'baja', estado: 'pendiente', fechaCreacion: '2026-05-15', fechaProgramada: '2026-05-30', fechaCompletada: null, tipoMantenimiento: 'preventivo' },
  { id: 6, equipoId: 6, tecnicoId: 3, titulo: 'Calibración de sensor de soldadura', descripcion: 'Calibrar sensores de temperatura y corriente del robot soldador.', prioridad: 'alta', estado: 'en_progreso', fechaCreacion: '2026-05-21', fechaProgramada: '2026-05-24', fechaCompletada: null, tipoMantenimiento: 'predictivo' },
  { id: 7, equipoId: 8, tecnicoId: 4, titulo: 'Mantenimiento anual HVAC', descripcion: 'Mantenimiento completo del sistema de climatización: limpieza, filtros, refrigerante.', prioridad: 'media', estado: 'completada', fechaCreacion: '2026-05-01', fechaProgramada: '2026-05-05', fechaCompletada: '2026-05-04', tipoMantenimiento: 'preventivo' },
  { id: 8, equipoId: 7, tecnicoId: 6, titulo: 'Reemplazo de rodamientos', descripcion: 'Cambiar rodamientos desgastados de la cinta transportadora.', prioridad: 'alta', estado: 'completada', fechaCreacion: '2026-05-19', fechaProgramada: '2026-05-21', fechaCompletada: '2026-05-21', tipoMantenimiento: 'correctivo' },
  { id: 9, equipoId: 10, tecnicoId: 1, titulo: 'Revisión de motor eléctrico', descripcion: 'Diagnóstico y reparación del motor del esmeril angular.', prioridad: 'urgente', estado: 'pendiente', fechaCreacion: '2026-05-23', fechaProgramada: '2026-05-24', fechaCompletada: null, tipoMantenimiento: 'correctivo' },
  { id: 10, equipoId: 11, tecnicoId: 5, titulo: 'Cambio de molde', descripcion: 'Reemplazar molde de la inyectora de plástico para nueva producción.', prioridad: 'media', estado: 'en_progreso', fechaCreacion: '2026-05-20', fechaProgramada: '2026-05-25', fechaCompletada: null, tipoMantenimiento: 'preventivo' },
  { id: 11, equipoId: 9, tecnicoId: 7, titulo: 'Lubricación general', descripcion: 'Lubricación de ejes y engranajes del taladro radial.', prioridad: 'baja', estado: 'pendiente', fechaCreacion: '2026-05-22', fechaProgramada: '2026-06-01', fechaCompletada: null, tipoMantenimiento: 'preventivo' },
  { id: 12, equipoId: 12, tecnicoId: 6, titulo: 'Inspección de cables de acero', descripcion: 'Revisar estado de cables y gancho de la grúa puente.', prioridad: 'alta', estado: 'completada', fechaCreacion: '2026-05-16', fechaProgramada: '2026-05-18', fechaCompletada: '2026-05-18', tipoMantenimiento: 'predictivo' },
  { id: 13, equipoId: 1, tecnicoId: 4, titulo: 'Verificación de tolerancias', descripcion: 'Medir y ajustar tolerancias del torno CNC.', prioridad: 'media', estado: 'pendiente', fechaCreacion: '2026-05-24', fechaProgramada: '2026-05-28', fechaCompletada: null, tipoMantenimiento: 'predictivo' },
  { id: 14, equipoId: 6, tecnicoId: 3, titulo: 'Actualización de firmware', descripcion: 'Actualizar software de control del robot soldador.', prioridad: 'baja', estado: 'en_progreso', fechaCreacion: '2026-05-22', fechaProgramada: '2026-05-26', fechaCompletada: null, tipoMantenimiento: 'predictivo' },
  { id: 15, equipoId: 4, tecnicoId: 2, titulo: 'Mantenimiento de secador', descripcion: 'Revisar y limpiar el secador de aire del compresor.', prioridad: 'media', estado: 'pendiente', fechaCreacion: '2026-05-23', fechaProgramada: '2026-05-29', fechaCompletada: null, tipoMantenimiento: 'preventivo' },
]

export const estados = {
  pendiente: 'Pendiente',
  en_progreso: 'En Progreso',
  completada: 'Completada',
}

export const prioridades = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const tiposMantenimiento = {
  preventivo: 'Preventivo',
  correctivo: 'Correctivo',
  predictivo: 'Predictivo',
}

export const compras = [
  { id: 1, proveedor: 'Repuestos Industriales SA', articulo: 'Rodamientos SKF 6205', cantidad: 10, unidad: 'unidades', precioUnitario: 450, fechaSolicitud: '2026-05-20', fechaEntrega: '2026-05-28', estado: 'recibido', ordenId: 8 },
  { id: 2, proveedor: 'Hidráulica del Sur', articulo: 'Aceite hidráulico ISO 46', cantidad: 20, unidad: 'litros', precioUnitario: 180, fechaSolicitud: '2026-05-18', fechaEntrega: '2026-05-22', estado: 'recibido', ordenId: 1 },
  { id: 3, proveedor: 'Eléctrica Central', articulo: 'Cable THW 10 AWG', cantidad: 100, unidad: 'metros', precioUnitario: 35, fechaSolicitud: '2026-05-22', fechaEntrega: '2026-06-05', estado: 'pendiente', ordenId: 2 },
  { id: 4, proveedor: 'Filtros Industriales', articulo: 'Filtro de aire comprimido', cantidad: 4, unidad: 'unidades', precioUnitario: 1200, fechaSolicitud: '2026-05-15', fechaEntrega: '2026-05-19', estado: 'recibido', ordenId: 5 },
  { id: 5, proveedor: 'SensorTech', articulo: 'Sensor de temperatura PT100', cantidad: 3, unidad: 'unidades', precioUnitario: 850, fechaSolicitud: '2026-05-21', fechaEntrega: null, estado: 'pendiente', ordenId: 6 },
  { id: 6, proveedor: 'Aceros del Norte', articulo: 'Plancha de acero 3/8"', cantidad: 2, unidad: 'planchas', precioUnitario: 3200, fechaSolicitud: '2026-05-23', fechaEntrega: '2026-05-30', estado: 'en_curso', ordenId: null },
  { id: 7, proveedor: 'Herramientas Pro', articulo: 'Juego de llaves allen', cantidad: 5, unidad: 'juegos', precioUnitario: 280, fechaSolicitud: '2026-05-24', fechaEntrega: null, estado: 'pendiente', ordenId: null },
  { id: 8, proveedor: 'Lubricantes Premium', articulo: 'Grasa multipropósito', cantidad: 10, unidad: 'kgs', precioUnitario: 150, fechaSolicitud: '2026-05-10', fechaEntrega: '2026-05-14', estado: 'recibido', ordenId: null },
]

export const estadosCompra = {
  pendiente: 'Pendiente',
  en_curso: 'En Curso',
  recibido: 'Recibido',
}
