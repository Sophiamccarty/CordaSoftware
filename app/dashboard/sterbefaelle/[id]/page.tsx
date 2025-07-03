'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  FileText,
  User,
  Heart,
  Users,
  Church,
  CreditCard,
  Calendar,
  Building,
  Package,
  Settings,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Image,
  Upload,
  Download,
  Share,
  Archive,
  Trash2,
  UserPlus,
  Plus,
  Save
} from 'lucide-react'

// Import the Sterbefall interfaces
interface SterbefallData {
  id: string
  auftrag: any
  verstorbener: any
  auftraggeber: any
  ehepartner: any
  bestattung: any
  posten: any[]
  angehoerige?: any
  fallNummer: string
  status: string
  createdAt: string
  updatedAt?: string
}

const tabs = [
  {
    id: 'uebersicht',
    label: 'Übersicht',
    icon: Eye,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'verstorbener',
    label: 'Verstorbener',
    icon: Heart,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'auftraggeber',
    label: 'Auftraggeber',
    icon: User,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'angehoerige',
    label: 'Angehörige',
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'bestattung',
    label: 'Bestattung',
    icon: Church,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'posten',
    label: 'Posten',
    icon: Package,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'dokumente',
    label: 'Dokumente',
    icon: FileText,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'termine',
    label: 'Termine',
    icon: Calendar,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'notizen',
    label: 'Notizen',
    icon: Edit,
    color: 'from-yellow-500 to-yellow-600'
  }
]

export default function SterbefallDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState('uebersicht')
  const [sterbefallData, setSterbefallData] = useState<SterbefallData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hinweise, setHinweise] = useState('')
  const [foto, setFoto] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch Sterbefall data
  useEffect(() => {
    const fetchSterbefallData = async () => {
      try {
        const response = await fetch(`/api/sterbefaelle/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSterbefallData(data)
        } else {
          // Handle error - maybe redirect back or show error
          console.error('Failed to fetch Sterbefall data')
        }
      } catch (error) {
        console.error('Error fetching Sterbefall data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSterbefallData()
    }
  }, [params.id])

  // Save changes function
  const saveChanges = async (updatedData: any) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/sterbefaelle/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        const result = await response.json()
        setSterbefallData(result)
        setSuccessMessage('Änderungen erfolgreich gespeichert!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setIsEditing(false)
      } else {
        throw new Error('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Fehler beim Speichern der Änderungen')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENTWURF':
        return 'bg-gray-500/20 text-gray-300 border-gray-500'
      case 'ERFASSUNG':
        return 'bg-blue-500/20 text-blue-300 border-blue-500'
      case 'BEARBEITUNG':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500'
      case 'BEHOERDEN':
        return 'bg-orange-500/20 text-orange-300 border-orange-500'
      case 'PLANUNG':
        return 'bg-purple-500/20 text-purple-300 border-purple-500'
      case 'TRAUERFEIER':
        return 'bg-pink-500/20 text-pink-300 border-pink-500'
      case 'ABGESCHLOSSEN':
        return 'bg-green-500/20 text-green-300 border-green-500'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500'
    }
  }

  const renderTabContent = () => {
    if (!sterbefallData) return null

    switch (activeTab) {
      case 'uebersicht':
        return (
          <div className="space-y-6">
            {/* Übersicht Header */}
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sterbefall-Übersicht</h2>
                  <p className="text-gray-400">Fall-Nr: {sterbefallData.fallNummer}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border ${getStatusColor(sterbefallData.status)}`}>
                  {sterbefallData.status}
                </div>
              </div>

              {/* Foto und Hinweise */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Foto */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Foto</label>
                  <div className="bg-gray-700 rounded-xl h-48 flex items-center justify-center relative group">
                    {foto ? (
                      <img src={foto} alt="Verstorbener" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <Image className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Kein Foto</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button className="bg-corda-gold text-black px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Foto hinzufügen</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hinweise */}
                <div className="lg:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-300">Wichtige Hinweise</label>
                  <textarea
                    value={hinweise}
                    onChange={(e) => setHinweise(e.target.value)}
                    placeholder="Wichtige Hinweise zu diesem Sterbefall..."
                    className="w-full h-44 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold resize-none"
                  />
                </div>
              </div>

              {/* Schnellübersicht */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Verstorbener Info */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-white">Verstorbener</h3>
                  </div>
                  <p className="text-red-300 font-medium">
                    {sterbefallData.verstorbener.anrede} {sterbefallData.verstorbener.vornamen} {sterbefallData.verstorbener.nachname}
                  </p>
                  {sterbefallData.verstorbener.verstorbenAm && (
                    <p className="text-gray-400 text-sm">
                      † {new Date(sterbefallData.verstorbener.verstorbenAm).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>

                {/* Auftraggeber Info */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Auftraggeber</h3>
                  </div>
                  <p className="text-green-300 font-medium">
                    {sterbefallData.auftraggeber.anrede} {sterbefallData.auftraggeber.vornamen} {sterbefallData.auftraggeber.nachname}
                  </p>
                  {sterbefallData.auftraggeber.telefon && (
                    <p className="text-gray-400 text-sm flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {sterbefallData.auftraggeber.telefon}
                    </p>
                  )}
                </div>

                {/* Bestattung Info */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Church className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Bestattung</h3>
                  </div>
                  <p className="text-purple-300 font-medium">
                    {sterbefallData.bestattung.bestattungsart}
                  </p>
                  {sterbefallData.bestattung.datum && (
                    <p className="text-gray-400 text-sm">
                      {new Date(sterbefallData.bestattung.datum).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>

                {/* Auftrag Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Auftrag</h3>
                  </div>
                  <p className="text-blue-300 font-medium">
                    {sterbefallData.auftrag.sachbearbeiter}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {sterbefallData.auftrag.filiale}
                  </p>
                </div>
              </div>
            </div>

            {/* Kosten Übersicht */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-corda-gold" />
                Kosten-Übersicht
              </h3>
              
              <div className="space-y-3">
                {sterbefallData.posten.map((posten, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{posten.bezeichnung}</p>
                      <p className="text-gray-400 text-sm">{posten.typ} • {posten.anzahl}x</p>
                    </div>
                    <div className="text-right">
                      <p className="text-corda-gold font-bold">{posten.gesamtpreis.toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-600 pt-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">Gesamtsumme</span>
                    <span className="text-2xl font-bold text-corda-gold">
                      {sterbefallData.posten.reduce((sum, posten) => sum + posten.gesamtpreis, 0).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-corda-gold" />
                Zeitlinie
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Sterbefall erfasst</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(sterbefallData.createdAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {sterbefallData.updatedAt && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Zuletzt bearbeitet</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(sterbefallData.updatedAt).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'verstorbener':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Verstorbener</h2>
                    <p className="text-gray-400">Persönliche Daten und Informationen</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Beenden' : 'Bearbeiten'}</span>
                </button>
              </div>
              
              {/* Persönliche Daten */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Anrede</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.verstorbener.anrede}>{sterbefallData.verstorbener.anrede}</option>
                      <option value="Herr">Herr</option>
                      <option value="Frau">Frau</option>
                      <option value="Divers">Divers</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.anrede || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Titel</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.titel}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.titel || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Vornamen</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.vornamen}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.vornamen || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Rufname</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.rufname}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.rufname || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Nachname</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.nachname}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.nachname || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburtsname</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.geburtsname}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.geburtsname || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Geburtsdaten */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-corda-gold" />
                Geburtsdaten
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburtsdatum</label>
                  {isEditing ? (
                    <input
                      type="date"
                      defaultValue={sterbefallData.verstorbener.geburtsdatum}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">
                      {sterbefallData.verstorbener.geburtsdatum ? 
                        new Date(sterbefallData.verstorbener.geburtsdatum).toLocaleDateString('de-DE') : '-'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburtsort</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.geburtsort}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.geburtsort || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburts-Standesamt</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.geburtsStandesamt}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.geburtsStandesamt || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburtenregister-Nr.</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.geburtenregisternummer}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.geburtenregisternummer || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sterbedaten */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-red-400" />
                Sterbedaten
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Verstorben am</label>
                  {isEditing ? (
                    <input
                      type="date"
                      defaultValue={sterbefallData.verstorbener.verstorbenAm}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">
                      {sterbefallData.verstorbener.verstorbenAm ? 
                        new Date(sterbefallData.verstorbener.verstorbenAm).toLocaleDateString('de-DE') : '-'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Verstorben um</label>
                  {isEditing ? (
                    <input
                      type="time"
                      defaultValue={sterbefallData.verstorbener.verstorbenZeit}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.verstorbenZeit || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Todesart</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.verstorbener.todesart}>{sterbefallData.verstorbener.todesart}</option>
                      <option value="Natürlich">Natürlich</option>
                      <option value="Unfall">Unfall</option>
                      <option value="Selbstmord">Selbstmord</option>
                      <option value="Unbekannt">Unbekannt</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.todesart || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Sterbeort</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.sterbeort}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.sterbeort || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Standesamt</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.standesamt}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.standesamt || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Sterberegister-Nr.</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.sterberegisternummer}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.sterberegisternummer || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Adresse */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-corda-gold" />
                Wohnadresse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Straße</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.strasse}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.strasse || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Hausnummer</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.hausnummer}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.hausnummer || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">PLZ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.plz}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.plz || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Ort</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.ort}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.ort || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Weitere Daten */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-corda-gold" />
                Weitere Daten
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Staatsangehörigkeit</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.staatsangehoerigkeit}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.staatsangehoerigkeit || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Familienstand</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.verstorbener.familienstand}>{sterbefallData.verstorbener.familienstand}</option>
                      <option value="ledig">ledig</option>
                      <option value="verheiratet">verheiratet</option>
                      <option value="geschieden">geschieden</option>
                      <option value="verwitwet">verwitwet</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.familienstand || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Konfession</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.konfession}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.konfession || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Beruf</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.beruf}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.beruf || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Kinder</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.verstorbener.kinder}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.verstorbener.kinder || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bemerkungen */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-corda-gold" />
                Bemerkungen
              </h3>
              
              {isEditing ? (
                <textarea
                  defaultValue={sterbefallData.verstorbener.bemerkungen}
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                  placeholder="Besondere Bemerkungen zum Verstorbenen..."
                />
              ) : (
                <div className="bg-gray-700/50 rounded-lg px-4 py-3 min-h-[8rem]">
                  <p className="text-white whitespace-pre-wrap">{sterbefallData.verstorbener.bemerkungen || 'Keine Bemerkungen'}</p>
                </div>
              )}
            </div>
            
            {/* Speichern Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // Erstelle updatedData Objekt mit aktuellen Formularwerten
                    const updatedData = {
                      ...sterbefallData,
                      verstorbener: {
                        ...sterbefallData.verstorbener,
                        // Hier würden normalerweise die Formularwerte gesammelt werden
                        // Für jetzt verwenden wir die existierenden Daten
                      }
                    }
                    saveChanges(updatedData)
                  }}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      <span>Speichert...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Änderungen speichern</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      
      case 'auftraggeber':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Auftraggeber</h2>
                    <p className="text-gray-400">Kontaktdaten und Informationen</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Beenden' : 'Bearbeiten'}</span>
                </button>
              </div>
              
              {/* Persönliche Daten */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Anrede</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.auftraggeber.anrede}>{sterbefallData.auftraggeber.anrede}</option>
                      <option value="Herr">Herr</option>
                      <option value="Frau">Frau</option>
                      <option value="Divers">Divers</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.anrede || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Titel</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.titel}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.titel || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Vornamen</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.vornamen}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.vornamen || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Nachname</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.nachname}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.nachname || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Geburtsdatum</label>
                  {isEditing ? (
                    <input
                      type="date"
                      defaultValue={sterbefallData.auftraggeber.geburtsdatum}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">
                      {sterbefallData.auftraggeber.geburtsdatum ? 
                        new Date(sterbefallData.auftraggeber.geburtsdatum).toLocaleDateString('de-DE') : '-'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Staatsangehörigkeit</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.staatsangehoerigkeit}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.staatsangehoerigkeit || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Kontaktdaten */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-corda-gold" />
                Kontaktdaten
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Telefon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      defaultValue={sterbefallData.auftraggeber.telefon}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.telefon || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">E-Mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={sterbefallData.auftraggeber.email}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.email || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Adresse */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-corda-gold" />
                Adresse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Straße</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.strasse}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.strasse || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Hausnummer</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.hausnummer}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.hausnummer || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">PLZ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.plz}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.plz || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Ort</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.ort}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.ort || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Verwandtschaftsverhältnis */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-400" />
                Verwandtschaftsverhältnis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Beziehung zum Verstorbenen</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.auftraggeber.beziehung}>{sterbefallData.auftraggeber.beziehung}</option>
                      <option value="Ehegatte/in">Ehegatte/in</option>
                      <option value="Lebenspartner/in">Lebenspartner/in</option>
                      <option value="Sohn">Sohn</option>
                      <option value="Tochter">Tochter</option>
                      <option value="Vater">Vater</option>
                      <option value="Mutter">Mutter</option>
                      <option value="Bruder">Bruder</option>
                      <option value="Schwester">Schwester</option>
                      <option value="Enkel/in">Enkel/in</option>
                      <option value="Neffe/Nichte">Neffe/Nichte</option>
                      <option value="Freund/in">Freund/in</option>
                      <option value="Bevollmächtigte/r">Bevollmächtigte/r</option>
                      <option value="Sonstige">Sonstige</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.beziehung || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Berechtigung</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.auftraggeber.berechtigung}>{sterbefallData.auftraggeber.berechtigung}</option>
                      <option value="Bestattungspflichtig">Bestattungspflichtig</option>
                      <option value="Bevollmächtigt">Bevollmächtigt</option>
                      <option value="Erbberechtigt">Erbberechtigt</option>
                      <option value="Sonstige">Sonstige</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.berechtigung || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Weitere Informationen */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-corda-gold" />
                Weitere Informationen
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Familienstand</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.auftraggeber.familienstand}>{sterbefallData.auftraggeber.familienstand}</option>
                      <option value="ledig">ledig</option>
                      <option value="verheiratet">verheiratet</option>
                      <option value="geschieden">geschieden</option>
                      <option value="verwitwet">verwitwet</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.familienstand || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Beruf</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.beruf}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.beruf || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Konfession</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.auftraggeber.konfession}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.auftraggeber.konfession || '-'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bemerkungen */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-corda-gold" />
                Bemerkungen
              </h3>
              
              {isEditing ? (
                <textarea
                  defaultValue={sterbefallData.auftraggeber.bemerkungen}
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                  placeholder="Besondere Bemerkungen zum Auftraggeber..."
                />
              ) : (
                <div className="bg-gray-700/50 rounded-lg px-4 py-3 min-h-[8rem]">
                  <p className="text-white whitespace-pre-wrap">{sterbefallData.auftraggeber.bemerkungen || 'Keine Bemerkungen'}</p>
                </div>
              )}
            </div>
            
            {/* Speichern Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // Erstelle updatedData Objekt mit aktuellen Formularwerten
                    const updatedData = {
                      ...sterbefallData,
                      verstorbener: {
                        ...sterbefallData.verstorbener,
                        // Hier würden normalerweise die Formularwerte gesammelt werden
                        // Für jetzt verwenden wir die existierenden Daten
                      }
                    }
                    saveChanges(updatedData)
                  }}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      <span>Speichert...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Änderungen speichern</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      
      case 'angehoerige':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Angehörige</h2>
                    <p className="text-gray-400">Familie und weitere Kontakte</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Angehörigen hinzufügen</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {sterbefallData.angehoerige?.angehoerige?.length > 0 ? (
                  sterbefallData.angehoerige.angehoerige.map((person: any, index: number) => (
                    <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white">{person.vornamen} {person.nachname}</h4>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">{person.beziehung}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Adresse:</span>
                          <p className="text-white">{person.strasse} {person.hausnummer}, {person.plz} {person.ort}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Telefon:</span>
                          <p className="text-white">{person.telefon || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">E-Mail:</span>
                          <p className="text-white">{person.email || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Noch keine Angehörigen erfasst</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'bestattung':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Church className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Bestattung</h2>
                    <p className="text-gray-400">Bestattungsart und Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Beenden' : 'Bearbeiten'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Bestattungsart</label>
                  {isEditing ? (
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value={sterbefallData.bestattung.bestattungsart}>{sterbefallData.bestattung.bestattungsart}</option>
                      <option value="Erdbestattung">Erdbestattung</option>
                      <option value="Feuerbestattung">Feuerbestattung</option>
                      <option value="Seebestattung">Seebestattung</option>
                      <option value="Baumbestattung">Baumbestattung</option>
                      <option value="Diamantbestattung">Diamantbestattung</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.bestattung.bestattungsart || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Datum</label>
                  {isEditing ? (
                    <input
                      type="date"
                      defaultValue={sterbefallData.bestattung.datum}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">
                      {sterbefallData.bestattung.datum ? 
                        new Date(sterbefallData.bestattung.datum).toLocaleDateString('de-DE') : '-'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Uhrzeit</label>
                  {isEditing ? (
                    <input
                      type="time"
                      defaultValue={sterbefallData.bestattung.uhrzeit}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.bestattung.uhrzeit || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Friedhof/Meer</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.bestattung.friedhofMeer}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.bestattung.friedhofMeer || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Grabstelle</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={sterbefallData.bestattung.grabstelle}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2">{sterbefallData.bestattung.grabstelle || '-'}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Mit Trauerfeier</label>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        defaultChecked={sterbefallData.bestattung.mitFeier}
                        className="w-5 h-5 bg-gray-700 border border-gray-600 rounded"
                      />
                    ) : (
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        sterbefallData.bestattung.mitFeier ? 'bg-green-500 border-green-500' : 'border-gray-500'
                      }`}>
                        {sterbefallData.bestattung.mitFeier && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    <span className="text-white">{sterbefallData.bestattung.mitFeier ? 'Ja' : 'Nein'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'posten':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Posten</h2>
                    <p className="text-gray-400">Leistungen und Kosten</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-corda-gold">
                    {sterbefallData.posten.reduce((sum, posten) => sum + posten.gesamtpreis, 0).toFixed(2)} €
                  </span>
                  <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Posten hinzufügen</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {sterbefallData.posten.length > 0 ? (
                  sterbefallData.posten.map((posten, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-white">{posten.bezeichnung}</h4>
                          <p className="text-sm text-gray-400">{posten.typ}</p>
                        </div>
                        <div className="text-white">{posten.anzahl}x</div>
                        <div className="text-white">{posten.einzelpreis.toFixed(2)} €</div>
                        <div className="font-bold text-corda-gold">{posten.gesamtpreis.toFixed(2)} €</div>
                        <div className="flex justify-end">
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Noch keine Posten erfasst</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'dokumente':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Dokumente</h2>
                    <p className="text-gray-400">Urkunden, Bescheinigungen und mehr</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Dokument hinzufügen</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Sterbeurkunde', 'Ärztliches Zeugnis', 'Personalausweis', 'Bestattungsvertrag'].map((doc, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-teal-400" />
                      <div>
                        <h4 className="font-semibold text-white">{doc}</h4>
                        <p className="text-sm text-gray-400">PDF • 2.1 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'termine':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Termine</h2>
                    <p className="text-gray-400">Wichtige Termine und Fristen</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Termin hinzufügen</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { titel: 'Bestattung', datum: '2025-07-10', zeit: '14:00', typ: 'Bestattung' },
                  { titel: 'Trauerfeier', datum: '2025-07-10', zeit: '13:00', typ: 'Feier' },
                  { titel: 'Besprechung mit Familie', datum: '2025-07-05', zeit: '10:00', typ: 'Beratung' }
                ].map((termin, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{termin.titel}</h4>
                          <p className="text-gray-400">{new Date(termin.datum).toLocaleDateString('de-DE')} um {termin.zeit}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg text-sm">{termin.typ}</span>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'notizen':
        return (
          <div className="space-y-6">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Edit className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Notizen</h2>
                    <p className="text-gray-400">Interne Notizen und Vermerke</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Notiz hinzufügen</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">Beratungsgespräch</h4>
                      <p className="text-sm text-gray-400">03.07.2025 - 09:30</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300">Familie wünscht schlichte Bestattung. Besonderer Wunsch: Lieblingsmusik während der Trauerfeier.</p>
                </div>
                
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <textarea
                    placeholder="Neue Notiz hinzufügen..."
                    className="w-full h-32 bg-transparent border-0 text-white placeholder-gray-400 resize-none focus:outline-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button className="px-4 py-2 bg-corda-gold text-black rounded-lg hover:bg-yellow-400 transition-colors">
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-corda-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-corda-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wird entwickelt</h3>
            <p className="text-gray-400">
              Dieser Reiter wird in zukünftigen Updates verfügbar sein.
            </p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-corda-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Sterbefall wird geladen...</p>
        </div>
      </div>
    )
  }

  if (!sterbefallData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sterbefall nicht gefunden</h2>
          <p className="text-gray-400 mb-6">Der angeforderte Sterbefall konnte nicht geladen werden.</p>
          <button
            onClick={() => router.push('/dashboard/sterbefaelle')}
            className="bg-corda-gold text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">Sterbefall-Akte</h1>
                <p className="text-gray-400">
                  {sterbefallData.verstorbener.anrede} {sterbefallData.verstorbener.vornamen} {sterbefallData.verstorbener.nachname}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Teilen</span>
              </button>
              
              <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Bearbeiten</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar with Tabs */}
          <div className="col-span-3">
            <div className="glass-morphism rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-6">Akten-Bereiche</h3>
              
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                        isActive
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}