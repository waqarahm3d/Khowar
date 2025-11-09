import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  Music,
  Mic2,
  Album,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/songs', icon: Music, label: 'Songs' },
    { to: '/artists', icon: Mic2, label: 'Artists' },
    { to: '/albums', icon: Album, label: 'Albums' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-500">Qoqnuz Admin</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.displayName}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
