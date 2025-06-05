'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus
} from 'lucide-react'
import { User, UserRole } from '@/lib/types'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('corda_token')
    const userData = localStorage.getItem('corda_user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    }

    setCurrentPath(window.location.pathname)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('corda_token')
    localStorage.removeItem('corda_user')
    router.push('/')
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      requiredRole: UserRole.AUSHILFE
    },
    {
      name: 'Sterbefälle',
      href: '/dashboard/sterbefaelle',
      icon: <FileText className="w-5 h-5" />,
      requiredRole: UserRole.MITARBEITER
    },
    {
      name: 'Vorsorgen',
      href: '/dashboard/vorsorgen',
      icon: <Users className="w-5 h-5" />,
      requiredRole: UserRole.MITARBEITER
    },
    {
      name: 'Termine',
      href: '/dashboard/termine',
      icon: <Calendar className="w-5 h-5" />,
      requiredRole: UserRole.MITARBEITER
    },
    {
      name: 'KI-Assistent',
      href: '/dashboard/ki-assistent',
      icon: <Brain className="w-5 h-5" />,
      requiredRole: UserRole.MITARBEITER
    },
    {
      name: 'Einstellungen',
      href: '/dashboard/einstellungen',
      icon: <Settings className="w-5 h-5" />,
      requiredRole: UserRole.MANAGER
    }
  ]

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false
    
    const roleHierarchy = {
      [UserRole.ADMIN]: 5,
      [UserRole.GESCHAEFTSFUEHRUNG]: 4,
      [UserRole.MANAGER]: 3,
      [UserRole.MITARBEITER]: 2,
      [UserRole.AUSHILFE]: 1,
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const filteredNavigation = navigationItems.filter(item => hasPermission(item.requiredRole))

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div 
      style={{ 
        margin: 0, 
        padding: 0, 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex'
      }}
      className="bg-gradient-to-br from-corda-black via-corda-anthracite to-corda-dark"
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - ABSOLUTE LEFT EDGE */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '320px',
          margin: 0,
          padding: 0,
          zIndex: 50
        }}
        className="bg-dark-gradient border-r border-gray-800 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-corda-gold" />
              <h1 className="text-2xl font-serif font-bold text-gradient">
                CORDA
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-corda-dark text-gray-400 hover:text-corda-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-corda-gold/20 rounded-full flex items-center justify-center">
                <span className="text-corda-gold font-semibold text-sm">
                  {user.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-corda-white">{user.username}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
                {user.company && (
                  <p className="text-xs text-gray-500">{user.company.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {filteredNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${currentPath === item.href ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(item.href)
                    setCurrentPath(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={() => router.push('/dashboard/sterbefaelle/neu')}
              className="btn-primary w-full mb-4 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Neuer Sterbefall</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-corda-dark/50 backdrop-blur-sm border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-corda-dark text-gray-400 hover:text-corda-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    className="bg-corda-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-corda-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold/20 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-corda-dark text-gray-400 hover:text-corda-white">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-corda-gold rounded-full" />
              </button>
              
              <div className="text-right">
                <p className="text-sm font-medium text-corda-white">{user.username}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - ABSOLUTELY NO PADDING OR MARGIN */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
} 