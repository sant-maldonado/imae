import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrdenes, useTecnicos } from '../hooks/useMockData'
import { estados, prioridades } from '../mocks/data'

const priorityColors = {
  urgente: 'bg-red-100 text-red-700 border-red-200',
  alta: 'bg-amber-100 text-amber-700 border-amber-200',
  media: 'bg-blue-100 text-blue-700 border-blue-200',
  baja: 'bg-slate-100 text-slate-700 border-slate-200',
}

const statusColors = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  en_progreso: 'bg-blue-50 text-blue-700 border-blue-200',
  completada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function WorkOrders() {
  const { data: ordenes, isLoading } = useOrdenes()
  const { data: tecnicos } = useTecnicos()
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [filtroTecnico, setFiltroTecnico] = useState('')

  const tecnicosMap = {}
  tecnicos?.forEach((t) => { tecnicosMap[t.id] = t.nombre })

  if (isLoading) return <div className="text-slate-500">Cargando órdenes...</div>

  const filtradas = ordenes.filter((o) => {
    if (filtroEstado && o.estado !== filtroEstado) return false
    if (filtroPrioridad && o.prioridad !== filtroPrioridad) return false
    if (filtroTecnico && o.tecnicoId !== Number(filtroTecnico)) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">Todos los estados</option>
            {Object.entries(estados).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">Todas las prioridades</option>
            {Object.entries(prioridades).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filtroTecnico}
            onChange={(e) => setFiltroTecnico(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">Todos los técnicos</option>
            {tecnicos?.filter((t) => t.activo).map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <Link
          to="/ordenes/nueva"
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva Orden
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Título</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Prioridad</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Técnico</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Programada</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((orden) => (
              <tr key={orden.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">#{orden.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{orden.titulo}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${priorityColors[orden.prioridad]}`}>
                    {prioridades[orden.prioridad]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{tecnicosMap[orden.tecnicoId] || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[orden.estado]}`}>
                    {estados[orden.estado]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{orden.fechaProgramada}</td>
                <td className="px-4 py-3">
                  <Link to={`/ordenes/${orden.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <p className="text-center text-slate-400 py-8">No se encontraron órdenes</p>
        )}
      </div>
    </div>
  )
}
