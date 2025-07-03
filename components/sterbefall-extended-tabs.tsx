'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard,
  DollarSign,
  Calculator,
  Receipt,
  Banknote,
  TrendingUp,
  Target,
  BarChart,
  PieChart,
  Church,
  Music,
  Users,
  Flower,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  FileText,
  Building,
  Upload,
  File,
  FileCheck,
  FolderOpen,
  Download,
  Trash,
  Eye2 as Eye,
  Filter,
  Search,
  MessageCircle,
  Send,
  Shield,
  CreditCard as CreditCardIcon,
  UserCheck,
  Archive as ArchiveIcon,
  AlertTriangle,
  Banknote as BanknoteIcon
} from 'lucide-react'

interface ExtendedTabProps {
  activeTab: string
  sterbefallData: any
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

// Helper components for authorities management
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { label: 'Ausstehend', color: 'yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
    inProgress: { label: 'In Bearbeitung', color: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-300' },
    completed: { label: 'Erledigt', color: 'green', bg: 'bg-green-500/20', text: 'text-green-300' },
    blocked: { label: 'Blockiert', color: 'red', bg: 'bg-red-500/20', text: 'text-red-300' }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export function SterbefallExtendedTabs({ activeTab, sterbefallData, isEditing, setIsEditing }: ExtendedTabProps) {
  
  const renderFinanzenTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Finanzen</h2>
              <p className="text-gray-400">Kosten, Zahlungen und Abrechnungen</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-corda-gold">4.850,00 €</p>
              <p className="text-sm text-gray-400">Gesamtbetrag</p>
            </div>
          </div>
        </div>
        
        {/* Kostenübersicht */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Kostenaufstellung
            </h3>
            
            <div className="space-y-4">
              {[
                { kategorie: 'Bestattungsleistungen', betrag: 2850.00, prozent: 58.8 },
                { kategorie: 'Friedhofsgebühren', betrag: 890.00, prozent: 18.4 },
                { kategorie: 'Fremdleistungen', betrag: 650.00, prozent: 13.4 },
                { kategorie: 'Trauerfeier', betrag: 460.00, prozent: 9.5 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{item.kategorie}</span>
                    <span className="text-green-300 font-semibold">{item.betrag.toFixed(2)} €</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.prozent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Zahlungsstatus
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-white">Anzahlung</span>
                <div className="text-right">
                  <p className="text-green-300 font-semibold">1.500,00 €</p>
                  <p className="text-green-400 text-xs">Eingegangen</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-white">Restbetrag</span>
                <div className="text-right">
                  <p className="text-yellow-300 font-semibold">3.350,00 €</p>
                  <p className="text-yellow-400 text-xs">Fällig in 14 Tagen</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-white">Zahlungsart</span>
                <div className="text-right">
                  <p className="text-blue-300 font-semibold">Überweisung</p>
                  <p className="text-blue-400 text-xs">IBAN: DE89 1234 5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Steuerberechnung */}
        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Steuerberechnung
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4.074,79 €</p>
              <p className="text-purple-300 text-sm">Nettobetrag</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">775,21 €</p>
              <p className="text-purple-300 text-sm">MwSt. (19%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-corda-gold">4.850,00 €</p>
              <p className="text-purple-300 text-sm">Bruttobetrag</p>
            </div>
          </div>
        </div>
        
        {/* Finanzierungsoptionen */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center">
            <Banknote className="w-5 h-5 mr-2" />
            Finanzierungsoptionen
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Ratenzahlung</h4>
              <p className="text-gray-400 text-sm mb-3">6 Monate à 575,00 €</p>
              <button className="w-full bg-orange-500/20 text-orange-300 py-2 rounded-lg hover:bg-orange-500/30 transition-colors">
                Antrag stellen
              </button>
            </div>
            
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Versicherung</h4>
              <p className="text-gray-400 text-sm mb-3">Direkte Abrechnung möglich</p>
              <button className="w-full bg-orange-500/20 text-orange-300 py-2 rounded-lg hover:bg-orange-500/30 transition-colors">
                Prüfen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTrauerfeierTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Church className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trauerfeier</h2>
              <p className="text-gray-400">Zeremonie und Abschied</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-corda-gold text-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Bearbeiten</span>
          </button>
        </div>
        
        {/* Grunddaten */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-400" />
              Termin & Ort
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Datum</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">15.07.2025</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Uhrzeit</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">14:00 Uhr</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Ort</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">Kapelle am Hauptfriedhof</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Adresse</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">Friedhofstraße 12, 80333 München</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Teilnehmer
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Erwartete Teilnehmer</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">ca. 80 Personen</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Trauerredner</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">Pfarrer Dr. Schmidt</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Kontakt</label>
                <p className="text-white bg-gray-700/50 rounded-lg px-3 py-2 mt-1">Tel: 089/123456</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Musik und Gestaltung */}
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Musik & Gestaltung
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Musikalische Gestaltung</h4>
              <div className="space-y-2">
                {[
                  'Eingangsmusik: "Amazing Grace"',
                  'Zwischenmusik: "Ave Maria"',
                  'Ausgangsmusik: "Time to Say Goodbye"',
                  'Organist: Herr Müller'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Blumenschmuck</h4>
              <div className="space-y-2">
                {[
                  'Sargschmuck: Weiße Rosen',
                  'Kranz der Familie: Rote Rosen',
                  'Gesteck: Lilien und Chrysanthemen',
                  'Florist: Blumen Schneider'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Flower className="w-4 h-4 text-pink-400" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Ablaufplan */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Ablaufplan
          </h3>
          
          <div className="space-y-4">
            {[
              { zeit: '13:45', aktivitaet: 'Eintreffen der Trauergäste', person: 'Bestatter vor Ort' },
              { zeit: '14:00', aktivitaet: 'Beginn der Trauerfeier', person: 'Pfarrer Dr. Schmidt' },
              { zeit: '14:05', aktivitaet: 'Eingangsmusik', person: 'Organist Müller' },
              { zeit: '14:10', aktivitaet: 'Trauerrede', person: 'Pfarrer Dr. Schmidt' },
              { zeit: '14:25', aktivitaet: 'Abschiednahme', person: 'Familie' },
              { zeit: '14:35', aktivitaet: 'Gang zum Grab', person: 'Trauergemeinschaft' },
              { zeit: '14:45', aktivitaet: 'Beisetzung', person: 'Pfarrer Dr. Schmidt' },
              { zeit: '15:00', aktivitaet: 'Kondolenz', person: 'Familie' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-indigo-300 font-mono text-sm min-w-[3rem]">{item.zeit}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.aktivitaet}</p>
                  <p className="text-gray-400 text-sm">{item.person}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderFriedhofTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Friedhof & Grabstelle</h2>
              <p className="text-gray-400">Ruhestätte und Grabpflege</p>
            </div>
          </div>
        </div>
        
        {/* Friedhof Informationen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              Friedhof Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Friedhof:</span>
                <span className="text-white">Hauptfriedhof München</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Abteilung:</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reihe:</span>
                <span className="text-white">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grabstelle:</span>
                <span className="text-white">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grabart:</span>
                <span className="text-white">Wahlgrab</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Laufzeit:</span>
                <span className="text-white">25 Jahre</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-green-400" />
              Gebühren & Kosten
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Grabgebühr:</span>
                <span className="text-white">450,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nutzungsgebühr:</span>
                <span className="text-white">280,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beisetzungsgebühr:</span>
                <span className="text-white">160,00 €</span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-3">
                <span className="text-white font-semibold">Gesamt:</span>
                <span className="text-corda-gold font-bold">890,00 €</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grabpflege */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
            <Flower className="w-5 h-5 mr-2" />
            Grabpflege & Gestaltung
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Bepflanzung</h4>
              <div className="space-y-2">
                {[
                  'Frühjahr: Stiefmütterchen',
                  'Sommer: Begonien und Fleißiges Lieschen',
                  'Herbst: Chrysanthemen',
                  'Winter: Tannenzweige'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Pflegevertrag</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gärtner:</span>
                  <span className="text-white">Friedhofsgärtnerei Schmidt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vertragslaufzeit:</span>
                  <span className="text-white">2 Jahre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monatliche Kosten:</span>
                  <span className="text-white">45,00 €</span>
                </div>
                <button className="w-full bg-green-500/20 text-green-300 py-2 rounded-lg hover:bg-green-500/30 transition-colors mt-3">
                  Vertrag anzeigen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBehoerdenTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Behörden & Ämter</h2>
              <p className="text-gray-400">Anmeldungen und behördliche Vorgänge</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Neuer Vorgang</span>
          </button>
        </div>
        
        {/* Übersicht Behördenvorgänge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-green-300 text-sm">Erledigt</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-yellow-300 text-sm">In Bearbeitung</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-red-300 text-sm">Ausstehend</p>
          </div>
        </div>
        
        {/* Aktuelle Vorgänge */}
        <div className="space-y-4">
          {[
            {
              behoerde: 'Standesamt München',
              vorgang: 'Sterbeurkunde beantragen',
              status: 'completed',
              frist: '15.07.2025',
              kontakt: 'Frau Müller',
              telefon: '089/233-96875',
              notizen: 'Sterbeurkunde in 5-facher Ausfertigung erhalten'
            },
            {
              behoerde: 'Krankenkasse TK',
              vorgang: 'Sterbegeld beantragen',
              status: 'inProgress',
              frist: '20.07.2025',
              kontakt: 'Herr Schmidt',
              telefon: '040/460-6555000',
              notizen: 'Unterlagen eingereicht, Bearbeitung läuft'
            },
            {
              behoerde: 'Rentenversicherung',
              vorgang: 'Rente abmelden',
              status: 'pending',
              frist: '18.07.2025',
              kontakt: 'Service-Center',
              telefon: '0800/1000-4800',
              notizen: 'Termin vereinbaren für persönliche Abmeldung'
            },
            {
              behoerde: 'Friedhofsverwaltung',
              vorgang: 'Grabstelle reservieren',
              status: 'completed',
              frist: '12.07.2025',
              kontakt: 'Herr Weber',
              telefon: '089/233-47850',
              notizen: 'Grabstelle 12-8-15 reserviert für 25 Jahre'
            }
          ].map((vorgang, index) => (
            <div key={index} className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{vorgang.behoerde}</h3>
                    <StatusBadge status={vorgang.status} />
                  </div>
                  <p className="text-blue-300 font-medium mb-2">{vorgang.vorgang}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Frist:</span>
                      <p className="text-white">{vorgang.frist}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Kontakt:</span>
                      <p className="text-white">{vorgang.kontakt}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Telefon:</span>
                      <p className="text-white">{vorgang.telefon}</p>
                    </div>
                  </div>
                  {vorgang.notizen && (
                    <div className="mt-3 p-3 bg-gray-600/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Notizen:</span>
                      <p className="text-gray-200 text-sm mt-1">{vorgang.notizen}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderWorkflowTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Workflow & Checklisten</h2>
              <p className="text-gray-400">Abläufe und Aufgabenverfolgung</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-corda-gold">75%</p>
              <p className="text-sm text-gray-400">Fortschritt</p>
            </div>
          </div>
        </div>
        
        {/* Workflow-Übersicht */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {[
            { phase: 'Erstaufnahme', status: 'completed', count: 8, total: 8 },
            { phase: 'Behörden', status: 'inProgress', count: 4, total: 6 },
            { phase: 'Vorbereitung', status: 'pending', count: 2, total: 5 },
            { phase: 'Durchführung', status: 'pending', count: 0, total: 3 }
          ].map((phase, index) => (
            <div key={index} className={`p-4 rounded-xl border ${
              phase.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
              phase.status === 'inProgress' ? 'bg-blue-500/10 border-blue-500/30' :
              'bg-gray-700/30 border-gray-600'
            }`}>
              <h3 className="text-white font-semibold mb-2">{phase.phase}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{phase.count}/{phase.total}</span>
                <div className={`w-3 h-3 rounded-full ${
                  phase.status === 'completed' ? 'bg-green-400' :
                  phase.status === 'inProgress' ? 'bg-blue-400' :
                  'bg-gray-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Aktuelle Aufgaben */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Nächste Aufgaben
          </h3>
          
          <div className="space-y-3">
            {[
              { aufgabe: 'Krematorium kontaktieren', frist: 'Heute', prioritaet: 'high', status: 'pending' },
              { aufgabe: 'Trauerredner bestätigen', frist: 'Morgen', prioritaet: 'medium', status: 'pending' },
              { aufgabe: 'Blumenschmuck bestellen', frist: '16.07.2025', prioritaet: 'medium', status: 'pending' },
              { aufgabe: 'Grabstein in Auftrag geben', frist: '20.07.2025', prioritaet: 'low', status: 'pending' }
            ].map((aufgabe, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-white font-medium">{aufgabe.aufgabe}</p>
                    <p className="text-gray-400 text-sm">Frist: {aufgabe.frist}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    aufgabe.prioritaet === 'high' ? 'bg-red-500/20 text-red-300' :
                    aufgabe.prioritaet === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {aufgabe.prioritaet === 'high' ? 'Hoch' : aufgabe.prioritaet === 'medium' ? 'Mittel' : 'Niedrig'}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Zeitplan */}
        <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Terminplan
          </h3>
          
          <div className="space-y-4">
            {[
              { datum: '15.07.2025', zeit: '14:00', termin: 'Trauerfeier', ort: 'Kapelle Hauptfriedhof', status: 'confirmed' },
              { datum: '16.07.2025', zeit: '10:00', termin: 'Grabsteinbesprechung', ort: 'Steinmetz Weber', status: 'pending' },
              { datum: '18.07.2025', zeit: '15:00', termin: 'Nachbesprechung Familie', ort: 'Bestattungsinstitut', status: 'scheduled' }
            ].map((termin, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-white font-semibold">{termin.datum}</p>
                    <p className="text-gray-400 text-sm">{termin.zeit}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{termin.termin}</p>
                    <p className="text-gray-400 text-sm">{termin.ort}</p>
                  </div>
                </div>
                
                <StatusBadge status={termin.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDokumenteTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Dokumente</h2>
              <p className="text-gray-400">Dokumentenverwaltung und Upload</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-teal-500/20 text-teal-300 rounded-xl hover:bg-teal-500/30 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Dokument hochladen</span>
            </button>
            <button className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {/* Upload Bereich */}
        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-2 border-dashed border-teal-500/30 rounded-xl p-8 mb-6 text-center">
          <Upload className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Dokumente hier ablegen</h3>
          <p className="text-gray-400 mb-4">Oder klicken Sie um Dateien auszuwählen</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>PDF, JPG, PNG, DOC</span>
            <span>•</span>
            <span>Max 10MB pro Datei</span>
          </div>
        </div>
        
        {/* Dokumentkategorien */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {[
            { kategorie: 'Behördendokumente', anzahl: 8, farbe: 'blue', icon: Building },
            { kategorie: 'Rechnungen', anzahl: 12, farbe: 'green', icon: Receipt },
            { kategorie: 'Verträge', anzahl: 5, farbe: 'purple', icon: FileCheck },
            { kategorie: 'Sonstiges', anzahl: 3, farbe: 'gray', icon: File }
          ].map((kategorie, index) => {
            const Icon = kategorie.icon
            return (
              <div key={index} className={`bg-${kategorie.farbe}-500/10 border border-${kategorie.farbe}-500/30 rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 text-${kategorie.farbe}-400`} />
                  <span className={`text-2xl font-bold text-${kategorie.farbe}-300`}>{kategorie.anzahl}</span>
                </div>
                <h3 className="text-white font-semibold">{kategorie.kategorie}</h3>
              </div>
            )
          })}
        </div>
        
        {/* Suchbereich */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Dokumente durchsuchen..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <select className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white">
            <option>Alle Kategorien</option>
            <option>Behördendokumente</option>
            <option>Rechnungen</option>
            <option>Verträge</option>
            <option>Sonstiges</option>
          </select>
        </div>
        
        {/* Dokumentenliste */}
        <div className="space-y-3">
          {[
            {
              name: 'Sterbeurkunde.pdf',
              kategorie: 'Behördendokumente',
              groesse: '2.4 MB',
              datum: '15.07.2025',
              status: 'verified',
              icon: FileCheck
            },
            {
              name: 'Krematorium_Rechnung.pdf',
              kategorie: 'Rechnungen',
              groesse: '1.8 MB',
              datum: '14.07.2025',
              status: 'pending',
              icon: Receipt
            },
            {
              name: 'Friedhof_Vertrag.pdf',
              kategorie: 'Verträge',
              groesse: '3.2 MB',
              datum: '12.07.2025',
              status: 'verified',
              icon: FileText
            },
            {
              name: 'Versicherung_Anzeige.pdf',
              kategorie: 'Behördendokumente',
              groesse: '1.5 MB',
              datum: '11.07.2025',
              status: 'verified',
              icon: Building
            },
            {
              name: 'Personalausweis_Scan.jpg',
              kategorie: 'Sonstiges',
              groesse: '890 KB',
              datum: '10.07.2025',
              status: 'verified',
              icon: File
            }
          ].map((dokument, index) => {
            const Icon = dokument.icon
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dokument.status === 'verified' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      dokument.status === 'verified' ? 'text-green-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{dokument.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{dokument.kategorie}</span>
                      <span>•</span>
                      <span>{dokument.groesse}</span>
                      <span>•</span>
                      <span>{dokument.datum}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {dokument.status === 'verified' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {dokument.status === 'pending' && (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                  
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Bulk Actions */}
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-700/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-gray-300">5 Dokumente ausgewählt</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
              Alle herunterladen
            </button>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
              Verschieben
            </button>
            <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderKommunikationTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kommunikation & Notizen</h2>
              <p className="text-gray-400">Gesprächsverläufe und wichtige Notizen</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Neue Notiz</span>
          </button>
        </div>
        
        {/* Schnell-Notiz */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Neue Notiz erstellen</h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <select className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white">
                <option>Allgemeine Notiz</option>
                <option>Telefonat</option>
                <option>E-Mail</option>
                <option>Persönliches Gespräch</option>
                <option>Wichtiger Hinweis</option>
              </select>
              <select className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white">
                <option>Normal</option>
                <option>Wichtig</option>
                <option>Dringend</option>
              </select>
            </div>
            <textarea
              placeholder="Notiz eingeben..."
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-gray-300 text-sm">Familie benachrichtigen</label>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Speichern</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Kommunikationsverlauf */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Verlauf</h3>
          
          {[
            {
              typ: 'Telefonat',
              titel: 'Rücksprache zur Trauerfeier',
              inhalt: 'Familie wünscht sich eine Änderung der Uhrzeit von 14:00 auf 15:00 Uhr. Kapelle ist verfügbar, Trauerredner wurde bereits kontaktiert.',
              autor: 'Max Mustermann',
              datum: '15.07.2025 09:30',
              prioritaet: 'wichtig',
              icon: Phone,
              farbe: 'green'
            },
            {
              typ: 'E-Mail',
              titel: 'Bestätigung Krematorium',
              inhalt: 'Krematorium bestätigt Termin für 16.07.2025 um 10:00 Uhr. Alle Unterlagen sind vollständig.',
              autor: 'System',
              datum: '14.07.2025 16:45',
              prioritaet: 'normal',
              icon: Mail,
              farbe: 'blue'
            },
            {
              typ: 'Notiz',
              titel: 'Besondere Wünsche Familie',
              inhalt: 'Familie möchte Lieblingsmusik des Verstorbenen: "Time to Say Goodbye". Organist wurde informiert.',
              autor: 'Sarah Schmidt',
              datum: '13.07.2025 14:20',
              prioritaet: 'normal',
              icon: Edit,
              farbe: 'yellow'
            },
            {
              typ: 'Wichtiger Hinweis',
              titel: 'Allergien beachten',
              inhalt: 'Auftraggeber hat Pollenallergie - bei Blumenwahl berücksichtigen. Empfehlung: Rosen statt Lilien.',
              autor: 'Max Mustermann',
              datum: '12.07.2025 11:15',
              prioritaet: 'dringend',
              icon: AlertTriangle,
              farbe: 'red'
            }
          ].map((eintrag, index) => {
            const Icon = eintrag.icon
            return (
              <div key={index} className="bg-gray-700/30 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 bg-${eintrag.farbe}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${eintrag.farbe}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">{eintrag.titel}</h4>
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {eintrag.typ}
                        </span>
                        {eintrag.prioritaet !== 'normal' && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            eintrag.prioritaet === 'dringend' ? 'bg-red-500/20 text-red-300' :
                            eintrag.prioritaet === 'wichtig' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {eintrag.prioritaet}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{eintrag.inhalt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>von {eintrag.autor}</span>
                        <span>{eintrag.datum}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 bg-gray-600/30 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderVersicherungTab = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Versicherung & Vorsorge</h2>
              <p className="text-gray-400">Versicherungsleistungen und Vorsorgeverträge</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Versicherung hinzufügen</span>
          </button>
        </div>
        
        {/* Versicherungsübersicht */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2.850,00 €</p>
            <p className="text-green-300 text-sm">Gedeckte Kosten</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <CreditCardIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-blue-300 text-sm">Aktive Verträge</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-yellow-300 text-sm">Offene Anträge</p>
          </div>
        </div>
        
        {/* Versicherungsverträge */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Versicherungsverträge</h3>
          
          {[
            {
              versicherung: 'Allianz Lebensversicherung',
              typ: 'Sterbegeldversicherung',
              betrag: '2.500,00 €',
              status: 'bewilligt',
              police: 'AL-789456123',
              kontakt: 'Frau Weber - 0800/123456',
              notizen: 'Auszahlung erfolgt direkt an Bestattungsinstitut'
            },
            {
              versicherung: 'AOK Bayern',
              typ: 'Sterbegeld Krankenkasse',
              betrag: '350,00 €',
              status: 'beantragt',
              police: 'AOK-456789',
              kontakt: 'Service-Center - 089/123456',
              notizen: 'Antrag gestellt am 14.07.2025'
            },
            {
              versicherung: 'Ergo Direkt',
              typ: 'Bestattungsvorsorge',
              betrag: '4.200,00 €',
              status: 'geprüft',
              police: 'ED-987654321',
              kontakt: 'Herr Schmidt - 0211/987654',
              notizen: 'Vollständige Kostenübernahme möglich'
            }
          ].map((vertrag, index) => (
            <div key={index} className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{vertrag.versicherung}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vertrag.status === 'bewilligt' ? 'bg-green-500/20 text-green-300' :
                      vertrag.status === 'beantragt' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {vertrag.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Vertragstyp:</span>
                      <p className="text-white font-medium">{vertrag.typ}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Leistung:</span>
                      <p className="text-cyan-300 font-bold">{vertrag.betrag}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Police-Nr:</span>
                      <p className="text-white">{vertrag.police}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Kontakt:</span>
                      <p className="text-white">{vertrag.kontakt}</p>
                    </div>
                  </div>
                  
                  {vertrag.notizen && (
                    <div className="mt-3 p-3 bg-gray-600/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Notizen:</span>
                      <p className="text-gray-200 text-sm mt-1">{vertrag.notizen}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Vorsorgeverträge */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Bestattungsvorsorge</h3>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ArchiveIcon className="w-8 h-8 text-purple-400" />
                <div>
                  <h4 className="text-white font-semibold">Bestattungsvorsorgevertrag</h4>
                  <p className="text-purple-300">Vollständig finanziert</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-300">4.200,00 €</p>
                <p className="text-gray-400 text-sm">Vertragswert</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Vertragspartner:</span>
                <p className="text-white">Ergo Direkt Vorsorge</p>
              </div>
              <div>
                <span className="text-gray-400">Abgeschlossen:</span>
                <p className="text-white">15.03.2020</p>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <p className="text-green-300">Vollständig eingezahlt</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
              <p className="text-purple-200 text-sm">
                <strong>Vereinbarte Leistungen:</strong> Komplette Bestattung inkl. Sarg, Kremierung, 
                Trauerfeier und Grabstelle. Alle Wünsche wurden bereits zu Lebzeiten festgelegt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  switch (activeTab) {
    case 'finanzen':
      return renderFinanzenTab()
    case 'trauerfeier':
      return renderTrauerfeierTab()
    case 'friedhof':
      return renderFriedhofTab()
    case 'behoerden':
      return renderBehoerdenTab()
    case 'workflow':
      return renderWorkflowTab()
    case 'dokumente':
      return renderDokumenteTab()
    case 'notizen':
      return renderKommunikationTab()
    case 'versicherung':
      return renderVersicherungTab()
    default:
      return null
  }
}