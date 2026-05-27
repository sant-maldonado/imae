import { equipos, tecnicos, ordenes, compras } from '../mocks/data'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function fetchEquipos() {
  await delay(300)
  return [...equipos]
}

export async function fetchEquipo(id) {
  await delay(200)
  const equipo = equipos.find((e) => e.id === Number(id))
  if (!equipo) throw new Error('Equipo no encontrado')
  return { ...equipo }
}

export async function fetchTecnicos() {
  await delay(300)
  return [...tecnicos]
}

export async function fetchTecnico(id) {
  await delay(200)
  return tecnicos.find((t) => t.id === Number(id))
}

export async function fetchOrdenes() {
  await delay(300)
  return [...ordenes]
}

export async function fetchOrden(id) {
  await delay(200)
  const orden = ordenes.find((o) => o.id === Number(id))
  if (!orden) throw new Error('Orden no encontrada')
  const equipo = equipos.find((e) => e.id === orden.equipoId)
  const tecnico = tecnicos.find((t) => t.id === orden.tecnicoId)
  return { ...orden, equipoNombre: equipo?.nombre, tecnicoNombre: tecnico?.nombre }
}

export async function createOrden(data) {
  await delay(400)
  const newId = Math.max(...ordenes.map((o) => o.id)) + 1
  const orden = { id: newId, ...data, fechaCreacion: new Date().toISOString().split('T')[0] }
  ordenes.unshift(orden)
  return orden
}

export async function updateOrden(id, data) {
  await delay(400)
  const idx = ordenes.findIndex((o) => o.id === Number(id))
  if (idx === -1) throw new Error('Orden no encontrada')
  ordenes[idx] = { ...ordenes[idx], ...data }
  return ordenes[idx]
}

export async function deleteOrden(id) {
  await delay(300)
  const idx = ordenes.findIndex((o) => o.id === Number(id))
  if (idx === -1) throw new Error('Orden no encontrada')
  ordenes.splice(idx, 1)
  return true
}

export async function fetchCompras() {
  await delay(300)
  return [...compras]
}

export async function fetchCompra(id) {
  await delay(200)
  const compra = compras.find((c) => c.id === Number(id))
  if (!compra) throw new Error('Compra no encontrada')
  return { ...compra }
}

export async function createCompra(data) {
  await delay(400)
  const newId = Math.max(...compras.map((c) => c.id)) + 1
  const compra = { id: newId, ...data, fechaSolicitud: new Date().toISOString().split('T')[0] }
  compras.unshift(compra)
  return compra
}

export async function updateCompra(id, data) {
  await delay(400)
  const idx = compras.findIndex((c) => c.id === Number(id))
  if (idx === -1) throw new Error('Compra no encontrada')
  compras[idx] = { ...compras[idx], ...data }
  return compras[idx]
}

export async function deleteCompra(id) {
  await delay(300)
  const idx = compras.findIndex((c) => c.id === Number(id))
  if (idx === -1) throw new Error('Compra no encontrada')
  compras.splice(idx, 1)
  return true
}

export async function fetchDashboardStats() {
  await delay(400)
  const total = ordenes.length
  const pendientes = ordenes.filter((o) => o.estado === 'pendiente').length
  const enProgreso = ordenes.filter((o) => o.estado === 'en_progreso').length
  const completadas = ordenes.filter((o) => o.estado === 'completada').length
  const urgentes = ordenes.filter((o) => o.prioridad === 'urgente' && o.estado !== 'completada').length
  const equiposOperativos = equipos.filter((e) => e.estado === 'operativo').length
  const equiposAveriados = equipos.filter((e) => e.estado === 'averiado').length

  const ordenesPorMes = Array.from({ length: 6 }, (_, i) => {
    const mes = new Date()
    mes.setMonth(mes.getMonth() - (5 - i))
    const mesStr = mes.toLocaleString('es', { month: 'short' })
    const count = ordenes.filter((o) => {
      const fecha = new Date(o.fechaCreacion)
      return fecha.getMonth() === mes.getMonth() && fecha.getFullYear() === mes.getFullYear()
    }).length
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
    totalEquipos: equipos.length,
    totalTecnicos: tecnicos.filter((t) => t.activo).length,
    ordenesPorMes,
  }
}
