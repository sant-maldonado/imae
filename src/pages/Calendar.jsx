import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrdenes } from '../hooks/useMockData'
import { estados, prioridades } from '../lib/constants'

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function Calendar() {
  const { data: ordenes, isLoading } = useOrdenes()

  const hoy = useMemo(() => new Date(), [])
  const [year, month] = [hoy.getFullYear(), hoy.getMonth()]

  const diasEnMes = new Date(year, month + 1, 0).getDate()
  const primerDia = new Date(year, month, 1).getDay()

  const ordenesPorFecha = useMemo(() => {
    const map = {}
    if (!ordenes) return map
    ordenes.filter((o) => o.estado !== 'completada').forEach((o) => {
      const fecha = o.fechaProgramada
      if (!map[fecha]) map[fecha] = []
      map[fecha].push(o)
    })
    return map
  }, [ordenes])

  if (isLoading) return <div className="text-slate-500">Cargando calendario...</div>

  const celdas = []
  for (let i = 0; i < primerDia; i++) {
    celdas.push(<div key={`empty-${i}`} className="min-h-[100px]" />)
  }
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    const ordenesDelDia = ordenesPorFecha[fechaStr] || []
    const esHoy = dia === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear()

    celdas.push(
      <div
        key={dia}
        className={`min-h-[100px] p-1.5 border border-slate-100 rounded-lg ${esHoy ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}
      >
        <span className={`text-xs font-medium ${esHoy ? 'text-blue-700' : 'text-slate-500'}`}>{dia}</span>
        <div className="mt-1 space-y-1">
          {ordenesDelDia.slice(0, 3).map((o) => (
            <Link
              key={o.id}
              to={`/ordenes/${o.id}`}
              className={`block text-[10px] leading-tight px-1.5 py-0.5 rounded truncate ${
                o.prioridad === 'urgente' ? 'bg-red-100 text-red-700' :
                o.prioridad === 'alta' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}
            >
              {o.titulo}
            </Link>
          ))}
          {ordenesDelDia.length > 3 && (
            <p className="text-[10px] text-slate-400 px-1">+{ordenesDelDia.length - 3} más</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{meses[month]} {year}</h3>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
        ))}
        {celdas}
      </div>
    </div>
  )
}
