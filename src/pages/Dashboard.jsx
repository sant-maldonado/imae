import { useDashboardStats } from '../hooks/useMockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const statusColors = {
  pendiente: 'bg-amber-500',
  en_progreso: 'bg-blue-500',
  completada: 'bg-emerald-500',
  urgente: 'bg-red-500',
}

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) return <div className="text-slate-500">Cargando dashboard...</div>

  const kpiCards = [
    { label: 'Órdenes Pendientes', value: stats.pendientes, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'En Progreso', value: stats.enProgreso, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Completadas', value: stats.completadas, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Urgentes', value: stats.urgentes, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border ${kpi.border} ${kpi.bg} p-5`}>
            <p className="text-sm text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Órdenes por Mes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.ordenesPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completadas" name="Completadas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendientes" name="Pendientes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Equipos</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Operativos</span>
                <span className="text-lg font-semibold text-emerald-600">{stats.equiposOperativos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Averiados</span>
                <span className="text-lg font-semibold text-red-600">{stats.equiposAveriados}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-600">Total</span>
                <span className="text-lg font-semibold text-slate-800">{stats.totalEquipos}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Técnicos Activos</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTecnicos}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Total Órdenes</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
