import { useLocation } from 'react-router-dom'

const titles = {
  '/': 'Dashboard',
  '/ordenes': 'Órdenes de Trabajo',
  '/equipos': 'Equipos',
  '/tecnicos': 'Técnicos',
  '/calendario': 'Calendario',
  '/reportes': 'Reportes',
}

export default function Header() {
  const location = useLocation()
  const basePath = '/' + location.pathname.split('/')[1]
  const title = titles[basePath] || 'Control de Mantenimiento'

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Operador</span>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
          OP
        </div>
      </div>
    </header>
  )
}
