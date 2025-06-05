'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Sterbefall {
  id: string
  fallNummer: string
  verstorbener: {
    anrede?: string
    vornamen?: string
    nachname?: string
    geburtsdatum?: string
    verstorbenAm?: string
    ort?: string
  }
  auftraggeber: {
    anrede?: string
    vornamen?: string
    nachname?: string
    telefon?: string
    email?: string
  }
  auftrag: {
    bestattungsart?: string
    sachbearbeiter?: string
  }
  status: string
  createdAt: string
  updatedAt?: string
}

const STATUS_COLORS = {
  ERFASSUNG: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  BEARBEITUNG: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  BEHOERDEN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  PLANUNG: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  TRAUERFEIER: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  ABGESCHLOSSEN: 'bg-green-500/20 text-green-400 border-green-500/30'
}

const STATUS_LABELS = {
  ERFASSUNG: 'Erfassung',
  BEARBEITUNG: 'Bearbeitung',
  BEHOERDEN: 'Behörden',
  PLANUNG: 'Planung',
  TRAUERFEIER: 'Trauerfeier',
  ABGESCHLOSSEN: 'Abgeschlossen'
}

export default function SterbefaellePage() {
  const router = useRouter()
  const [sterbefaelle, setSterbefaelle] = useState<Sterbefall[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('alle')

  useEffect(() => {
    loadSterbefaelle()
  }, [])

  const loadSterbefaelle = async () => {
    try {
      const response = await fetch('/api/sterbefaelle')
      if (response.ok) {
        const data = await response.json()
        setSterbefaelle(data)
      }
    } catch (error) {
      console.error('Error loading Sterbefälle:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSterbefaelle = sterbefaelle.filter(fall => {
    const matchesSearch = !searchQuery || 
      fall.fallNummer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${fall.verstorbener.vornamen} ${fall.verstorbener.nachname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${fall.auftraggeber.vornamen} ${fall.auftraggeber.nachname}`.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'alle' || fall.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-corda-gold" />
                Sterbefälle
              </h1>
              <p className="text-gray-400 mt-2">Übersicht aller erfassten Sterbefälle</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/sterbefaelle/neu')}
              className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg shadow-corda-gold/25 hover:shadow-corda-gold/40 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Neuer Sterbefall</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="glass-morphism rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suchen nach Fall-Nr., Name des Verstorbenen oder Auftraggeber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-xl pl-12 pr-8 py-3 text-white focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 min-w-[180px]"
              >
                <option value="alle">Alle Status</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sterbefälle Liste */}
        {loading ? (
          <div className="glass-morphism rounded-2xl p-12 text-center">
            <Clock className="w-12 h-12 text-corda-gold mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Lade Sterbefälle...</p>
          </div>
        ) : filteredSterbefaelle.length === 0 ? (
          <div className="glass-morphism rounded-2xl p-12 text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || statusFilter !== 'alle' ? 'Keine Ergebnisse' : 'Noch keine Sterbefälle'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'alle' 
                ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                : 'Erstellen Sie Ihren ersten Sterbefall.'
              }
            </p>
            {!searchQuery && statusFilter === 'alle' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/sterbefaelle/neu')}
                className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Ersten Sterbefall erstellen
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSterbefaelle.map((fall, index) => (
              <motion.div
                key={fall.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                    {/* Fall Info */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-corda-gold">{fall.fallNummer}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[fall.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.ERFASSUNG}`}>
                          {STATUS_LABELS[fall.status as keyof typeof STATUS_LABELS] || fall.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(fall.createdAt)}
                      </div>
                    </div>

                    {/* Verstorbener */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Verstorbener</h4>
                      <p className="text-gray-300">
                        {fall.verstorbener.anrede} {fall.verstorbener.vornamen} {fall.verstorbener.nachname}
                      </p>
                      {fall.verstorbener.geburtsdatum && (
                        <p className="text-sm text-gray-400">
                          *{formatDate(fall.verstorbener.geburtsdatum)}
                          {fall.verstorbener.verstorbenAm && ` †${formatDate(fall.verstorbener.verstorbenAm)}`}
                        </p>
                      )}
                      {fall.verstorbener.ort && (
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {fall.verstorbener.ort}
                        </div>
                      )}
                    </div>

                    {/* Auftraggeber */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Auftraggeber</h4>
                      <p className="text-gray-300">
                        {fall.auftraggeber.anrede} {fall.auftraggeber.vornamen} {fall.auftraggeber.nachname}
                      </p>
                      {fall.auftraggeber.telefon && (
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {fall.auftraggeber.telefon}
                        </div>
                      )}
                      {fall.auftraggeber.email && (
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {fall.auftraggeber.email}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Details</h4>
                      {fall.auftrag.bestattungsart && (
                        <p className="text-sm text-gray-400">{fall.auftrag.bestattungsart}</p>
                      )}
                      {fall.auftrag.sachbearbeiter && (
                        <p className="text-sm text-gray-400">
                          Bearbeiter: {fall.auftrag.sachbearbeiter}
                        </p>
                      )}
                      {fall.updatedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Aktualisiert: {formatDateTime(fall.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/dashboard/sterbefaelle/${fall.id}`)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Anzeigen"
                    >
                      <Eye className="w-4 h-4 text-gray-300" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/dashboard/sterbefaelle/${fall.id}/edit`)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                      title="Bearbeiten"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {!loading && sterbefaelle.length > 0 && (
          <div className="mt-8 glass-morphism rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sterbefaelle.length}</div>
                <div className="text-sm text-gray-400">Gesamt</div>
              </div>
              {Object.entries(STATUS_LABELS).map(([status, label]) => {
                const count = sterbefaelle.filter(fall => fall.status === status).length
                return (
                  <div key={status} className="text-center">
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-sm text-gray-400">{label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 