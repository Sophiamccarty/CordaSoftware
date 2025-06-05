'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Brain,
  BarChart3,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  Activity,
  Sparkles,
  TrendingDown,
  Eye,
  Star,
  Shield,
  Globe,
  Heart,
  Coffee
} from 'lucide-react'
import { DashboardStats, SterbefallStatus, ActivityLog, ActivityType } from '@/lib/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock data for now - will be replaced with real API calls
      setStats({
        totalSterbefaelle: 127,
        aktiveSterbefaelle: 8,
        abgeschlosseneSterbefaelle: 119,
        totalVorsorgen: 234,
        aktiveVorsorgen: 45,
        umsatzMonat: 125000,
        umsatzJahr: 1480000,
        durchschnittlicheBearbeitungszeit: 3.2
      })

      setRecentActivities([
        {
          id: '1',
          type: ActivityType.STERBEFALL_ERSTELLT,
          description: 'Neuer Sterbefall angelegt: Max Mustermann',
          userId: 'user1',
          createdAt: new Date(),
          details: { fallNummer: 'SF-2024-001' }
        },
        {
          id: '2',
          type: ActivityType.KI_VERWENDET,
          description: 'Trauerrede mit KI generiert für Familie Schmidt',
          userId: 'user1',
          createdAt: new Date(Date.now() - 3600000),
          details: { typ: 'Trauerrede', stil: 'persoenlich' }
        },
        {
          id: '3',
          type: ActivityType.STERBEFALL_ABGESCHLOSSEN,
          description: 'Sterbefall erfolgreich abgeschlossen: Anna Schmidt',
          userId: 'user2',
          createdAt: new Date(Date.now() - 7200000),
          details: { fallNummer: 'SF-2024-002' }
        },
        {
          id: '4',
          type: ActivityType.VORSORGE_ERSTELLT,
          description: 'Neue Vorsorge angelegt: Familie Müller',
          userId: 'user3',
          createdAt: new Date(Date.now() - 12600000),
          details: { typ: 'Vollvorsorge' }
        }
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Aktive Sterbefälle',
      value: stats?.aktiveSterbefaelle || 0,
      icon: <FileText className="w-7 h-7" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/30',
      change: '+2 diese Woche',
      changeType: 'increase',
      percentage: '+12%'
    },
    {
      title: 'Vorsorgen',
      value: stats?.totalVorsorgen || 0,
      icon: <Shield className="w-7 h-7" />,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      change: '+12 diesen Monat',
      changeType: 'increase',
      percentage: '+24%'
    },
    {
      title: 'Ø Bearbeitungszeit',
      value: `${stats?.durchschnittlicheBearbeitungszeit || 0}h`,
      icon: <Zap className="w-7 h-7" />,
      color: 'text-corda-gold',
      bgGradient: 'from-yellow-600/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-yellow-500/30',
      change: '-1.3h verbessert',
      changeType: 'decrease',
      percentage: '-28%'
    },
    {
      title: 'Monatsumsatz',
      value: `${((stats?.umsatzMonat || 0) / 1000).toFixed(0)}k €`,
      icon: <TrendingUp className="w-7 h-7" />,
      color: 'text-purple-400',
      bgGradient: 'from-purple-600/20 via-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      change: '+8% vs. Vormonat',
      changeType: 'increase',
      percentage: '+8%'
    }
  ]

  const quickActions = [
    {
      title: 'Neuer Sterbefall',
      description: '20-Minuten Express-Workflow starten',
      icon: <Plus className="w-6 h-6" />,
      href: '/dashboard/sterbefaelle/neu',
      gradient: 'from-corda-gold via-yellow-500 to-amber-400',
      iconBg: 'bg-gradient-to-br from-corda-gold to-yellow-600',
      urgent: true
    },
    {
      title: 'KI-Assistent',
      description: 'Trauerrede in 30 Sekunden generieren',
      icon: <Brain className="w-6 h-6" />,
      href: '/dashboard/ki-assistent',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      popular: true
    },
    {
      title: 'Termine planen',
      description: 'Trauerfeier oder Beratung organisieren',
      icon: <Calendar className="w-6 h-6" />,
      href: '/dashboard/termine',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-700'
    },
    {
      title: 'Analytics',
      description: 'Erweiterte Statistiken & Einblicke',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/dashboard/analytics',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-purple-600 to-pink-700'
    }
  ]

  const performanceMetrics = [
    {
      label: 'Effizienz-Score',
      value: '94%',
      icon: <Target className="w-5 h-5" />,
      color: 'text-emerald-400',
      trend: '+5%'
    },
    {
      label: 'Kundenzufriedenheit',
      value: '4.9',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-400',
      trend: '+0.2'
    },
    {
      label: 'Aktive Workflows',
      value: '23',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400',
      trend: '+7'
    }
  ]

  const getActivityIcon = (type: ActivityType) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case ActivityType.STERBEFALL_ERSTELLT:
        return <Plus className={`${iconClass} text-blue-400`} />
      case ActivityType.STERBEFALL_ABGESCHLOSSEN:
        return <CheckCircle className={`${iconClass} text-emerald-400`} />
      case ActivityType.KI_VERWENDET:
        return <Brain className={`${iconClass} text-corda-gold`} />
      case ActivityType.VORSORGE_ERSTELLT:
        return <Shield className={`${iconClass} text-purple-400`} />
      default:
        return <FileText className={`${iconClass} text-gray-400`} />
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Gerade eben'
    if (diffInHours === 1) return 'Vor 1 Stunde'
    if (diffInHours < 24) return `Vor ${diffInHours} Stunden`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Gestern'
    return `Vor ${diffInDays} Tagen`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-corda-black via-corda-anthracite to-corda-dark">
        <div className="space-y-8 p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="loading-skeleton h-10 w-64 rounded-xl" />
              <div className="loading-skeleton h-6 w-96 rounded-lg" />
            </div>
            <div className="loading-skeleton h-12 w-48 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-morphism-card p-6 rounded-2xl">
                <div className="loading-skeleton h-24 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-corda-black via-corda-anthracite to-corda-dark px-6 py-6 space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-corda-white via-corda-gold to-corda-white bg-clip-text text-transparent font-serif">
            Dashboard
          </h1>
          <p className="text-xl text-gray-300 flex items-center gap-2">
            <Heart className="w-5 h-5 text-corda-gold" />
            Willkommen zurück! Heute sind 8 Fälle aktiv und {stats?.totalVorsorgen} Vorsorgen verwaltet.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Letzter Login: Heute, 08:30
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Alle Systeme online
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-corda-gold via-yellow-500 to-amber-400 text-black font-semibold px-8 py-4 rounded-2xl shadow-2xl shadow-corda-gold/25 hover:shadow-corda-gold/40 transition-all duration-300 flex items-center gap-3 group"
            onClick={() => window.location.href = '/dashboard/sterbefaelle/neu'}
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span>Neuer Sterbefall</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-morphism-button px-6 py-4 rounded-2xl flex items-center gap-3 group"
          >
            <Eye className="w-5 h-5 text-corda-gold group-hover:text-yellow-300 transition-colors" />
            <span className="text-corda-white">Live Ansicht</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`glass-morphism-card p-6 rounded-2xl border ${card.borderColor} relative overflow-hidden group cursor-pointer`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-corda-white">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.color} bg-white/5 group-hover:bg-white/10 transition-colors duration-300`}>
                  {card.icon}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  card.changeType === 'increase' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {card.percentage}
                </span>
                <p className="text-xs text-gray-500">{card.change}</p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-corda-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass-morphism-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-corda-gold/20 rounded-lg">
              <Award className="w-6 h-6 text-corda-gold" />
            </div>
            <h3 className="text-xl font-semibold text-corda-white">Performance Metriken</h3>
          </div>
          <span className="text-sm text-gray-400">Live-Daten</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.color} bg-white/10`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <p className="text-lg font-semibold text-corda-white">{metric.value}</p>
                </div>
              </div>
              <span className="text-sm text-emerald-400 font-medium">
                {metric.trend}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Quick Actions */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="glass-morphism-card rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-corda-gold/20 rounded-lg">
                  <Zap className="w-6 h-6 text-corda-gold" />
                </div>
                <h2 className="text-xl font-semibold text-corda-white">
                  Schnellaktionen
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="block p-4 rounded-xl border border-gray-700/50 hover:border-corda-gold/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${action.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-corda-white group-hover:text-corda-gold transition-colors duration-300">
                          {action.title}
                        </h3>
                        {action.urgent && (
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                            Urgent
                          </span>
                        )}
                        {action.popular && (
                          <span className="px-2 py-1 text-xs bg-corda-gold/20 text-corda-gold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Beliebt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-corda-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Recent Activities */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="glass-morphism-card rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-corda-white">
                    Live Aktivitäten
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group border-l-2 border-transparent hover:border-corda-gold/50"
                    >
                      <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-corda-white group-hover:text-corda-gold transition-colors duration-300 font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-gray-400">
                            {getTimeAgo(activity.createdAt)}
                          </p>
                          {activity.details && (
                            <span className="px-2 py-1 text-xs bg-corda-gold/20 text-corda-gold rounded-full">
                              {String(Object.values(activity.details)[0])}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <motion.a
                  href="/dashboard/aktivitaeten"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-sm text-corda-gold hover:text-corda-gold-accent transition-all duration-300 group"
                >
                  <span>Alle Aktivitäten anzeigen</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced KI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-corda-gold/20 via-yellow-500/10 to-amber-400/20" />
        <div className="glass-morphism-card p-8 border border-corda-gold/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="p-4 bg-gradient-to-br from-corda-gold to-yellow-600 rounded-2xl shadow-2xl shadow-corda-gold/25"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-corda-white">
                    KI-Assistent bereit
                  </h3>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-corda-gold" />
                    <span className="text-sm text-corda-gold font-medium">NEU</span>
                  </div>
                </div>
                <p className="text-gray-300 max-w-2xl">
                  Revolutionäre KI erstellt automatisch Trauerreden, Anzeigen und Danksagungen in Sekunden. 
                  Mit persönlichem Touch und professioneller Qualität.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    847 Texte generiert
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    4.9/5 Bewertung
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-corda-gold via-yellow-500 to-amber-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-corda-gold/25 transition-all duration-300 flex items-center gap-2 group"
                onClick={() => window.location.href = '/dashboard/ki-assistent'}
              >
                <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>KI starten</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-morphism-button px-6 py-3 rounded-xl border border-corda-gold/30 hover:border-corda-gold/50 transition-all duration-300"
              >
                <span className="text-corda-white">Demo ansehen</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 