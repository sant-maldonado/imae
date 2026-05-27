import { NavLink, Link } from 'react-router-dom'
import { FiTool } from 'react-icons/fi'

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/ordenes', label: 'Órdenes', icon: '📋' },
  { to: '/compras', label: 'Compras', icon: '🛒' },
  { to: '/equipos', label: 'Equipos', icon: '⚙️' },
  { to: '/tecnicos', label: 'Técnicos', icon: '👷' },
  { to: '/calendario', label: 'Calendario', icon: '📅' },
  { to: '/reportes', label: 'Reportes', icon: '📈' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <Link
        to="/"
        className="p-5 border-b border-slate-700 flex items-center justify-center hover:bg-blue-900/30 transition-colors"
      >
        <FiTool className="w-8 h-8 text-blue-400" />
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-800 text-white'
                  : 'text-slate-300 hover:bg-blue-900/50 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        v1.0.0
      </div>
    </aside>
  )
}
