import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrden, useDeleteOrden, useUpdateOrden } from '../hooks/useMockData'
import { estados, prioridades, tiposMantenimiento } from '../mocks/data'

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

export default function WorkOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: orden, isLoading } = useOrden(id)
  const deleteOrden = useDeleteOrden()
  const updateOrden = useUpdateOrden()

  if (isLoading) return <div className="text-slate-500">Cargando orden...</div>
  if (!orden) return <div className="text-slate-500">Orden no encontrada</div>

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta orden de trabajo?')) {
      await deleteOrden.mutateAsync(id)
      navigate('/ordenes')
    }
  }

  const handleCompletar = async () => {
    await updateOrden.mutateAsync({
      id,
      data: { estado: 'completada', fechaCompletada: new Date().toISOString().split('T')[0] },
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/ordenes" className="hover:text-blue-600">Órdenes</Link>
        <span>/</span>
        <span className="text-slate-800">#{orden.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{orden.titulo}</h3>
            <p className="text-sm text-slate-500 mt-1">Creada el {orden.fechaCreacion}</p>
          </div>
          <div className="flex gap-2">
            {orden.estado !== 'completada' && (
              <button
                onClick={handleCompletar}
                className="bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Completar
              </button>
            )}
            <button
              onClick={handleDelete}
              className="border border-red-300 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Estado</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[orden.estado]}`}>
              {estados[orden.estado]}
            </span>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Prioridad</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${priorityColors[orden.prioridad]}`}>
              {prioridades[orden.prioridad]}
            </span>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Equipo</p>
            <p className="font-medium text-slate-700">{orden.equipoNombre}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Técnico asignado</p>
            <p className="font-medium text-slate-700">{orden.tecnicoNombre}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Tipo de mantenimiento</p>
            <p className="font-medium text-slate-700">{tiposMantenimiento[orden.tipoMantenimiento]}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Fecha programada</p>
            <p className="font-medium text-slate-700">{orden.fechaProgramada}</p>
          </div>
          {orden.fechaCompletada && (
            <div className="col-span-2">
              <p className="text-slate-500 mb-1">Fecha de completación</p>
              <p className="font-medium text-slate-700">{orden.fechaCompletada}</p>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-slate-500 mb-1">Descripción</p>
            <p className="text-slate-700">{orden.descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
