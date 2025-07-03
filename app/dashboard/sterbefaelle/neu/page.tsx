'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Heart, 
  Users, 
  Church, 
  CreditCard, 
  Save, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Clock,
  Copy,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Building,
  FileText,
  Calculator,
  Building2,
  List,
  Package,
  X,
  AlertTriangle,
  Car,
  Edit3,
  Check,
  Settings,
  Filter,
  GripVertical,
  ChevronRight,
  FolderOpen,
  PlayCircle,
  Eye
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SterbefallVorschau } from '@/components/sterbefall-vorschau'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

interface PersonData {
  anrede?: string
  titel?: string
  vornamen?: string
  rufname?: string
  nachname?: string
  geburtsname?: string
  staatsangehoerigkeit?: string
  strasse?: string
  hausnummer?: string
  plz?: string
  ort?: string
  geburtsort?: string
  geburtsdatum?: string
  geburtsStandesamt?: string
  geburtenregisternummer?: string
  familienstand?: string
  kinder?: string
  konfession?: string
  beruf?: string
  verstorbenAm?: string
  verstorbenZeit?: string
  aufgefundenAm?: string
  aufgefundenZeit?: string
  bemerkungen?: string
  todesart?: string
  sterbeort?: string
  sterbeortStrasse?: string
  sterbeortHausnummer?: string
  sterbeortPlz?: string
  sterbeortOrt?: string
  sterbeortOrtsteil?: string
  standesamt?: string
  sterberegisternummer?: string
  polizei?: string
  aktenzeichen?: string
  arzt?: string
  infektios?: boolean
  telefon?: string
  email?: string
  hochzeitsdatum?: string
  hochzeitsort?: string
  eheStandesamt?: string
  eheregisternummer?: string
  scheidungsdatum?: string
  amtsgericht?: string
  scheidungsAktenzeichen?: string
  beziehung?: string
  bankIban?: string
  bankBic?: string
  bankName?: string
  zahlungsart?: 'ueberweisung' | 'lastschrift'
  ortsteil?: string
  alter?: number
  geburtenregisternummerPrefix?: string
  sterberegisternummerPrefix?: string
  todeszeitraum?: string
  todeszeitraumVon?: string
  todeszeitraumVonZeit?: string
  todeszeitraumBis?: string
  todeszeitraumBisZeit?: string
  staatsanwaltschaftAktenzeichen?: string
  obduktionsort?: string
  staatsanwaltschaftEingeschaltet?: boolean
  polizeistation?: string
  staatsanwaltschaft?: string
  leichenfreigabe?: string
  leichenfreigabeDatum?: string
  infektionskrankheit?: string
  sterbeortDetails?: string
  individuellKonfession?: string
}

interface AuftragData {
  sachbearbeiter: string
  filiale: string
  hatVorsorge: boolean
  vorsorgeNummer?: string
  bestattungsart: string
}

interface BestattungData {
  bestattungsart: string
  // Krematorium
  krematorium?: string
  krematoriumAdresse?: string
  krematoriumPlaceId?: string
  krematoriumGeometry?: any
  friedhofMeer?: string
  friedhofMeerAdresse?: string // Zusätzliche Adressinfo vom Friedhof
  friedhofMeerPlaceId?: string // Google Place ID für weitere Abfragen
  friedhofMeerGeometry?: any // Geokoordinaten des Friedhofs
  mitFeier: boolean
  // Neue Felder für spezifische Trauerfeier-Arten bei Feuerbestattung
  mitSargfeier?: boolean
  mitUrnenfeier?: boolean
  // Separate Felder für Sargfeier
  sargfeierDatum?: string
  sargfeierZeit?: string
  sargfeierOrt?: string
  // Separate Felder für Urnenfeier/Trauerfeier
  urnenfeierDatum?: string
  urnenfeierZeit?: string
  urnenfeierOrt?: string
  grabart?: string
  abteilung?: string
  reihe?: string
  nummer?: string
  vorbelegungName?: string
  zuletztBeigesetzt?: string
  verlaengerungBis?: string
  nutzungsrechtUebertragen?: boolean
  nutzungsrechtPerson?: string
  bemerkungen?: string
  // Neue Felder
  beisetzungsdatum?: string
  trauerfeierdatum?: string
  trauerfeierZeit?: string
  trauerfeierort?: string
  vorbelegungVorhanden?: boolean
  nutzungsrechtAufAuftraggeber?: boolean
  nutzungsrechtPersonVorname?: string
  nutzungsrechtPersonNachname?: string
  nutzungsrechtPersonStrasse?: string
  nutzungsrechtPersonHausnummer?: string
  nutzungsrechtPersonPlz?: string
  nutzungsrechtPersonOrt?: string
  nutzungsrechtPersonGeburtsdatum?: string
  nutzungsrechtPersonBeziehung?: string
  nutzungsrechtPersonTelefon?: string
}

interface PostenData {
  id: string
  typ: 'eigen' | 'fremd' | 'durchlaufend' | 'handelsware'
  bezeichnung: string
  einzelpreis: number
  anzahl: number
  gesamtpreis: number
  kategorie?: string
  beschreibung?: string
  isVorlage?: boolean
  isCustom?: boolean
  steuersatz?: number
  nettopreis?: number
  bruttopreis?: number
  steuerBetrag?: number
  preisIstBrutto?: boolean
}

interface PostenListeData {
  id: string
  name: string
  beschreibung?: string
  posten: PostenData[]
  istSystemliste: boolean
  erstelltVon?: string
  erstelltAm?: string
}

interface PostenVorlageData {
  id: string
  typ: 'eigen' | 'fremd' | 'durchlaufend' | 'handelsware'
  bezeichnung: string
  kategorie: string
  beschreibung?: string
  einzelpreis: number
  istBasisPosten: boolean
  nurGeschaeftsfuehrung: boolean
}

interface AngehoerigerData {
  id: string
  verwandschaftsgrad: string
  anrede?: string
  titel?: string
  vornamen?: string
  nachname?: string
  geburtsdatum?: string
  strasse?: string
  hausnummer?: string
  plz?: string
  ort?: string
  ortsteil?: string
  telefon?: string
  email?: string
  istMinderjährig?: boolean
  istAuftraggeber?: boolean
}

interface AngehoerigeData {
  angehoerige: AngehoerigerData[]
  kinderVorhanden: boolean
  anzahlKinder?: number
  anzahlMinderjaehrigeKinder?: number
}

interface BestattungsVorlageData {
  id: string
  name: string
  beschreibung?: string
  bestattungsart: string
  krematorium?: string
  krematoriumAdresse?: string
  friedhofMeer?: string
  friedhofMeerAdresse?: string
  mitFeier: boolean
  mitSargfeier?: boolean
  mitUrnenfeier?: boolean
  grabart?: string
  abteilung?: string
  reihe?: string
  bemerkungen?: string
  istSystemvorlage: boolean
  erstelltVon?: string
  erstelltAm?: string
}

interface AktenEintragData {
  id: string
  typ: 'verstorbener' | 'vorsorge' | 'anfrage'
  name: string
  verstorbenAm?: string
  bestattungsdaten: BestattungData
  verstorbenerDaten: PersonData
  auftraggeberDaten: PersonData
  ehepartnerDaten?: PersonData
}

const TABS = [
  { id: 'auftrag', name: 'Auftrag', icon: FileText },
  { id: 'verstorbener', name: 'Verstorbener', icon: User },
  { id: 'auftraggeber', name: 'Auftraggeber', icon: Users },
  { id: 'ehepartner', name: 'Ehepartner', icon: Heart },
  { id: 'angehoerige', name: 'Angehörige', icon: Users },
  { id: 'bestattung', name: 'Bestattung', icon: Church },
  { id: 'posten', name: 'Posten', icon: Calculator }
]

const ANREDEN = ['Herr', 'Frau', 'Divers']
const TITEL = ['Dr.', 'Prof.', 'Prof. Dr.', 'Dr. med.', 'Dr. phil.', 'Dipl.-Ing.']
const STAATSANGEHOERIGKEITEN = ['deutsch', 'österreichisch', 'schweizerisch', 'italienisch', 'französisch', 'polnisch', 'türkisch', 'andere']
const FAMILIENSTAENDE = ['ledig', 'verheiratet', 'geschieden', 'verwitwet', 'eingetragene Lebenspartnerschaft']
const KONFESSIONEN = [
  // Hauptkonfessionen
  'evangelisch',
  'katholisch',
  
  // Evangelische Kirchen
  'evangelisch-lutherisch',
  'evangelisch-reformiert', 
  'evangelisch-uniert',
  'evangelisch-freikirchlich',
  
  // Orthodoxe Kirchen
  'russisch-orthodox',
  'griechisch-orthodox',
  'serbisch-orthodox',
  'rumänisch-orthodox',
  'bulgarisch-orthodox',
  'orthodox (andere)',
  
  // Andere christliche Konfessionen
  'baptistisch',
  'methodistisch',
  'pfingstkirchlich',
  'neuapostolisch',
  'adventistisch',
  'mennonitisch',
  'anglikanisch',
  'christlich-orthodox',
  'freie evangelische Gemeinde',
  'landeskirchliche Gemeinschaft',
  
  // Andere Religionen
  'muslimisch',
  'muslimisch-sunnitisch', 
  'muslimisch-schiitisch',
  'muslimisch-alevitisch',
  'jüdisch',
  'buddhistisch',
  'hinduistisch',
  'sikhistisch',
  'bahaitisch',
  
  // Keine Religion
  'konfessionslos',
  'keine Angabe',
  'andere'
]
const BESTATTUNGSARTEN = ['Erdbestattung', 'Feuerbestattung', 'Seebestattung', 'Reerdigung']
const TODESARTEN = ['natürlicher Tod', 'unnatürlicher Tod']
const GRABARTEN = ['Einzelgrab', 'Doppelgrab', 'Familiengrab', 'Urnengrab', 'Kolumbarium', 'anonymes Grab']
const BEZIEHUNGEN = ['Ehepartner/in', 'Kind', 'Elternteil', 'Geschwister', 'Großeltern', 'Enkel', 'andere Verwandte', 'Freund/in', 'Betreuer/in', 'andere']
const STERBEORTE = ['Eigene Wohnung', 'Krankenhaus', 'Pflegeeinrichtung', 'Hospiz', 'Andere']
const INFEKTIONSKRANKHEITEN = ['nicht bekannt', 'COVID-19', 'Hepatitis', 'HIV', 'Tuberkulose', 'MRSA', 'Andere']
const LEICHENFREIGABE_OPTIONEN = ['Leichnahm nicht beschlagnahmt', 'Leichnahm beschlagnahmt', 'Leichnahm freigegeben']

// Vorgefertigte Posten-Listen
const POSTEN_TEMPLATES = {
  erdbestattung: [
    { bezeichnung: 'Überführung', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Sarg Eiche', einzelpreis: 850, anzahl: 1 },
    { bezeichnung: 'Sargausstattung', einzelpreis: 120, anzahl: 1 },
    { bezeichnung: 'Ankleiden/Einbetten', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Trauerfeier Organisation', einzelpreis: 280, anzahl: 1 },
    { bezeichnung: 'Friedhofsgebühren', einzelpreis: 650, anzahl: 1 },
    { bezeichnung: 'Standesamt Anmeldung', einzelpreis: 35, anzahl: 1 }
  ],
  feuerbestattung: [
    { bezeichnung: 'Überführung', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremationssarg', einzelpreis: 450, anzahl: 1 },
    { bezeichnung: 'Ankleiden/Einbetten', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremierung', einzelpreis: 380, anzahl: 1 },
    { bezeichnung: 'Urne Bronze', einzelpreis: 280, anzahl: 1 },
    { bezeichnung: 'Trauerfeier Organisation', einzelpreis: 280, anzahl: 1 },
    { bezeichnung: 'Standesamt Anmeldung', einzelpreis: 35, anzahl: 1 }
  ],
  seebestattung: [
    { bezeichnung: 'Überführung', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremationssarg', einzelpreis: 450, anzahl: 1 },
    { bezeichnung: 'Ankleiden/Einbetten', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremierung', einzelpreis: 380, anzahl: 1 },
    { bezeichnung: 'Seeurne wasserlöslich', einzelpreis: 150, anzahl: 1 },
    { bezeichnung: 'Seebestattung', einzelpreis: 680, anzahl: 1 },
    { bezeichnung: 'Standesamt Anmeldung', einzelpreis: 35, anzahl: 1 }
  ],
  reerdigung: [
    { bezeichnung: 'Überführung', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremationssarg', einzelpreis: 450, anzahl: 1 },
    { bezeichnung: 'Ankleiden/Einbetten', einzelpreis: 180, anzahl: 1 },
    { bezeichnung: 'Kremierung', einzelpreis: 380, anzahl: 1 },
    { bezeichnung: 'Urne Bronze', einzelpreis: 280, anzahl: 1 },
    { bezeichnung: 'Trauerfeier Organisation', einzelpreis: 280, anzahl: 1 },
    { bezeichnung: 'Standesamt Anmeldung', einzelpreis: 35, anzahl: 1 }
  ]
}

const VERWANDSCHAFTSGRADE = [
  'Kind', 
  'Elternteil', 
  'Geschwister', 
  'Großeltern', 
  'Enkel', 
  'Tante/Onkel', 
  'Nichte/Neffe', 
  'Cousin/Cousine',
  'Schwiegerkind',
  'Schwiegermutter/Schwiegervater',
  'Schwager/Schwägerin',
  'Stiefkind',
  'Stiefmutter/Stiefvater',
  'Andere Verwandte',
  'Freund/in',
  'Betreuer/in',
  'Andere'
]

const GRABARTEN_ERDBESTATTUNG = [
  'Reihengrab',
  'Wahlgrab Einzelgrab', 
  'Wahlgrab Doppelgrab',
  'Wahlgrab Familiengrab',
  'Rasengrab',
  'Grab mit besonderer Gestaltung'
]

const GRABARTEN_FEUERBESTATTUNG = [
  'Urnengrab Reihe',
  'Urnengrab Wahlgrab',
  'Urnengemeinschaftsanlage',
  'Kolumbarium',
  'Baumgrab/Baumplatz',
  'Urnenrasengrab',
  'Anonymes Urnengrab',
  'Partnergrab für Urnen'
]

const GRABARTEN_SEEBESTATTUNG = [
  'Seebestattung Nord- oder Ostsee',
  'Seebestattung andere Gewässer'
]

export default function NeuerSterbefallPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('auftrag')
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'create' | null>(null)
  const [showVorschau, setShowVorschau] = useState(false)
  
  // Form Data States
  const [auftragData, setAuftragData] = useState<AuftragData>({
    sachbearbeiter: 'Max Mustermann',
    filiale: 'Hauptsitz',
    hatVorsorge: false,
    bestattungsart: ''
  })
  
  const [verstorbenerData, setVerstorbenerData] = useState<PersonData>({
    staatsangehoerigkeit: 'deutsch'
  })
  const [auftraggeberData, setAuftraggeberData] = useState<PersonData>({
    staatsangehoerigkeit: 'deutsch'
  })
  const [ehepartnerData, setEhepartnerData] = useState<PersonData>({})
  const [angehoerigeData, setAngehoerigeData] = useState<AngehoerigeData>({
    angehoerige: [],
    kinderVorhanden: false
  })
  const [bestattungData, setBestattungData] = useState<BestattungData>({
    bestattungsart: '',
    mitFeier: true
  })
  const [postenData, setPostenData] = useState<PostenData[]>([])
  
  // Completion tracking
  const [tabCompletion, setTabCompletion] = useState({
    auftrag: 0,
    verstorbener: 0,
    auftraggeber: 0,
    ehepartner: 0,
    angehoerige: 0,
    bestattung: 0,
    posten: 0
  })

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoSaving) {
        autoSave()
      }
    }, 30000) // Auto-save every 30 seconds
    
    return () => clearInterval(interval)
  }, [verstorbenerData, auftraggeberData, ehepartnerData, angehoerigeData, bestattungData, postenData])

  const autoSave = async () => {
    setAutoSaving(true)
    // Here we would save to localStorage or backend
    setTimeout(() => setAutoSaving(false), 1000)
  }

  // Calculate tab completion percentage
  const calculateCompletion = useCallback((tabId: string, data: any) => {
    const requiredFields = {
      auftrag: ['sachbearbeiter', 'filiale', 'bestattungsart'],
      verstorbener: ['anrede', 'vornamen', 'nachname', 'geburtsdatum', 'verstorbenAm'],
      auftraggeber: ['anrede', 'vornamen', 'nachname', 'telefon'],
      ehepartner: ['anrede', 'vornamen', 'nachname'],
      angehoerige: [],
      bestattung: ['bestattungsart'],
      posten: []
    }
    
    const fields = requiredFields[tabId as keyof typeof requiredFields] || []
    if (fields.length === 0) {
      if (tabId === 'angehoerige') {
        // Angehörige ist optional, aber wenn Kinder vorhanden sind, sollten sie erfasst werden
        if (data.kinderVorhanden && data.anzahlKinder > 0) {
          const erfassteKinder = data.angehoerige.filter((a: AngehoerigerData) => a.verwandschaftsgrad === 'Kind').length
          return erfassteKinder >= data.anzahlKinder ? 100 : Math.round((erfassteKinder / data.anzahlKinder) * 100)
        }
        return 100
      }
      return 100
    }
    
    const filledFields = fields.filter(field => {
      if (tabId === 'auftrag') return auftragData[field as keyof AuftragData]
      if (tabId === 'bestattung') return bestattungData[field as keyof BestattungData]
      return data[field] && data[field] !== ''
    }).length
    
    return Math.round((filledFields / fields.length) * 100)
  }, [auftragData, bestattungData])

  // Update completion when data changes
  useEffect(() => {
    setTabCompletion({
      auftrag: calculateCompletion('auftrag', auftragData),
      verstorbener: calculateCompletion('verstorbener', verstorbenerData),
      auftraggeber: calculateCompletion('auftraggeber', auftraggeberData),
      ehepartner: calculateCompletion('ehepartner', ehepartnerData),
      angehoerige: calculateCompletion('angehoerige', angehoerigeData),
      bestattung: calculateCompletion('bestattung', bestattungData),
      posten: postenData.length > 0 ? 100 : 0
    })
  }, [auftragData, verstorbenerData, auftraggeberData, ehepartnerData, angehoerigeData, bestattungData, postenData, calculateCompletion])

  // Bestimme welche Tabs angezeigt werden sollen
  const shouldShowEhepartnerTab = () => {
    const familienstand = verstorbenerData.familienstand
    return familienstand === 'verheiratet' || 
           familienstand === 'verwitwet' || 
           familienstand === 'geschieden' || 
           familienstand === 'eingetragene Lebenspartnerschaft'
  }

  // Gefilterte Tabs basierend auf Familienstand
  const visibleTabs = TABS.filter(tab => {
    if (tab.id === 'ehepartner') {
      return shouldShowEhepartnerTab()
    }
    return true
  })

  // Automatisch zu anderem Tab wechseln wenn aktueller Tab nicht mehr sichtbar ist
  useEffect(() => {
    if (activeTab === 'ehepartner' && !shouldShowEhepartnerTab()) {
      setActiveTab('bestattung') // Wechsle zu Bestattung Tab
    }
  }, [verstorbenerData.familienstand, activeTab])

  // Copy data between sections
  const copyData = (from: PersonData, to: 'auftraggeber' | 'ehepartner', fields: string[]) => {
    const copiedData = fields.reduce((acc, field) => {
      const value = from[field as keyof PersonData]
      if (value !== undefined && value !== '') {
        (acc as any)[field] = value
      }
      return acc
    }, {} as Partial<PersonData>)
    
    if (to === 'auftraggeber') {
      setAuftraggeberData(prev => ({ ...prev, ...copiedData }))
    } else {
      setEhepartnerData(prev => ({ ...prev, ...copiedData }))
    }
  }

  // Auto-fill address with Google Places API
  const handleAddressLookup = async (query: string, targetSetter: any) => {
    if (!query || query.length < 3) return
    
    try {
      const response = await fetch(`/api/address-lookup?query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Address suggestions:', data.results)
        // Here you could implement a dropdown with suggestions
        // For now, just log the results
      }
    } catch (error) {
      console.error('Address lookup error:', error)
    }
  }

  // Load Posten Templates based on Bestattungsart
  const loadPostenTemplate = (bestattungsart: string) => {
    let templatePosten: PostenData[] = []
    
    switch (bestattungsart) {
      case 'Erdbestattung':
        templatePosten = [
          {
            id: `temp-${Date.now()}-1`,
            typ: 'eigen',
            bezeichnung: 'Überführung',
            einzelpreis: 150.00,
            anzahl: 1,
            gesamtpreis: 150.00,
            kategorie: 'Transport',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-2`,
            typ: 'eigen',
            bezeichnung: 'Bestattungsleistung',
            einzelpreis: 800.00,
            anzahl: 1,
            gesamtpreis: 800.00,
            kategorie: 'Dienstleistung',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-3`,
            typ: 'eigen',
            bezeichnung: 'Sarg (Eiche)',
            einzelpreis: 1200.00,
            anzahl: 1,
            gesamtpreis: 1200.00,
            kategorie: 'Sarg',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-4`,
            typ: 'fremd',
            bezeichnung: 'Friedhofsgebühren',
            einzelpreis: 450.00,
            anzahl: 1,
            gesamtpreis: 450.00,
            kategorie: 'Friedhof',
            isVorlage: false,
            isCustom: false
          }
        ]
        break
        
      case 'Feuerbestattung':
        templatePosten = [
          {
            id: `temp-${Date.now()}-1`,
            typ: 'eigen',
            bezeichnung: 'Krematoriumsgebühr',
            einzelpreis: 300.00,
            anzahl: 1,
            gesamtpreis: 300.00,
            kategorie: 'Krematorium',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-2`,
            typ: 'fremd',
            bezeichnung: 'Urne (Keramik)',
            einzelpreis: 180.00,
            anzahl: 1,
            gesamtpreis: 180.00,
            kategorie: 'Urne',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-3`,
            typ: 'eigen',
            bezeichnung: 'Bestattungsleistung',
            einzelpreis: 600.00,
            anzahl: 1,
            gesamtpreis: 600.00,
            kategorie: 'Dienstleistung',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `temp-${Date.now()}-4`,
            typ: 'eigen',
            bezeichnung: 'Sarg für Kremation',
            einzelpreis: 400.00,
            anzahl: 1,
            gesamtpreis: 400.00,
            kategorie: 'Sarg',
            isVorlage: false,
            isCustom: false
          }
        ]
        break
    }
    
    setPostenData(templatePosten)
  }

  // Save as Draft
  const handleSaveAsDraft = async () => {
    setLoading(true)
    
    try {
      const sterbefallData = {
        auftrag: auftragData,
        verstorbener: verstorbenerData,
        auftraggeber: auftraggeberData,
        ehepartner: ehepartnerData,
        angehoerige: angehoerigeData,
        bestattung: bestattungData,
        posten: postenData,
        fallNummer: `SF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status: 'ENTWURF'
      }
      
      const response = await fetch('/api/sterbefaelle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sterbefallData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save Sterbefall')
      }
      
      const result = await response.json()
      console.log('Sterbefall draft saved successfully:', result)
      
      // Show success message
      alert('Entwurf wurde erfolgreich gespeichert!')
    } catch (error) {
      console.error('Error saving Sterbefall draft:', error)
      alert('Fehler beim Speichern des Entwurfs: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Create Sterbefall (with preview)
  const handleCreateSterbefall = () => {
    setShowVorschau(true)
  }

  const confirmCreateSterbefall = async () => {
    setLoading(true)
    setShowVorschau(false)
    
    try {
      const sterbefallData = {
        auftrag: auftragData,
        verstorbener: verstorbenerData,
        auftraggeber: auftraggeberData,
        ehepartner: ehepartnerData,
        angehoerige: angehoerigeData,
        bestattung: bestattungData,
        posten: postenData,
        fallNummer: `SF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status: 'ERFASSUNG'
      }
      
      const response = await fetch('/api/sterbefaelle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sterbefallData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create Sterbefall')
      }
      
      const result = await response.json()
      console.log('Sterbefall created successfully:', result)
      
      // Redirect to Sterbefall-Akte
      router.push(`/dashboard/sterbefaelle/${result.id}`)
    } catch (error) {
      console.error('Error creating Sterbefall:', error)
      alert('Fehler beim Anlegen des Sterbefalls: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Legacy save function (keeping for compatibility)
  const handleSave = handleSaveAsDraft

  const renderTabContent = () => {
    switch (activeTab) {
      case 'auftrag':
        return <AuftragTab 
          data={auftragData} 
          setData={setAuftragData}
          onBestattungsartChange={loadPostenTemplate}
        />
      case 'verstorbener':
        return <VerstorbenerTab 
          data={verstorbenerData} 
          setData={setVerstorbenerData}
          onAddressLookup={handleAddressLookup}
        />
      case 'auftraggeber':
        return <AuftraggeberTab 
          data={auftraggeberData} 
          setData={setAuftraggeberData}
          onCopyFromVerstorbener={() => copyData(verstorbenerData, 'auftraggeber', ['nachname', 'strasse', 'hausnummer', 'plz', 'ort', 'ortsteil'])}
          onAddressLookup={handleAddressLookup}
        />
      case 'ehepartner':
        return <EhepartnerTab 
          data={ehepartnerData} 
          setData={setEhepartnerData}
          onCopyFromVerstorbener={() => copyData(verstorbenerData, 'ehepartner', ['strasse', 'hausnummer', 'plz', 'ort', 'ortsteil', 'staatsangehoerigkeit'])}
          onAddressLookup={handleAddressLookup}
          verstorbenerData={verstorbenerData}
          auftraggeberData={auftraggeberData}
        />
      case 'angehoerige':
        return <AngehoerigeTab
          data={angehoerigeData}
          setData={setAngehoerigeData}
          auftraggeberData={auftraggeberData}
          onAddressLookup={handleAddressLookup}
        />
      case 'bestattung':
        return <BestattungTab 
          data={bestattungData} 
          setData={setBestattungData}
          verstorbenerData={verstorbenerData}
          auftragData={auftragData}
          auftraggeberData={auftraggeberData}
        />
      case 'posten':
        return <PostenTab 
          data={postenData} 
          setData={setPostenData}
          bestattungsart={auftragData.bestattungsart}
          onLoadTemplate={loadPostenTemplate}
        />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-corda-gold" />
                  Neuer Sterbefall
                </h1>
                <p className="text-gray-400">Erfassen Sie einen neuen Sterbefall</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {autoSaving && (
                <div className="flex items-center space-x-2 text-corda-gold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Automatisch gespeichert</span>
                </div>
              )}
              
              {/* Speichern als Entwurf Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveAsDraft}
                disabled={loading}
                className="bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-slate-500/25 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Speichert...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Als Entwurf speichern</span>
                  </>
                )}
              </motion.button>
              
              {/* Sterbefall anlegen Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateSterbefall}
                disabled={loading}
                className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg shadow-corda-gold/25 hover:shadow-corda-gold/40 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Legt an...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    <span>Sterbefall anlegen</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar with Tabs */}
          <div className="col-span-3">
            <div className="glass-morphism rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-6">Fortschritt</h3>
              
              <div className="space-y-2">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon
                  const completion = tabCompletion[tab.id as keyof typeof tabCompletion]
                  const isActive = activeTab === tab.id
                  
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-corda-gold/20 to-yellow-500/20 border border-corda-gold/30' 
                          : 'hover:bg-gray-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-corda-gold' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                            {tab.name}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 bg-gradient-to-r from-corda-gold to-yellow-500 rounded-full transition-all duration-500"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{completion}%</span>
                          </div>
                        </div>
                        {completion === 100 && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Overall Progress */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Gesamt</span>
                  <span className="text-sm text-corda-gold">
                    {Math.round(Object.values(tabCompletion).reduce((a, b) => a + b, 0) / Object.keys(tabCompletion).length)}%
                  </span>
                </div>
                <div className="bg-gray-600 rounded-full h-3">
                  <div 
                    className="h-3 bg-gradient-to-r from-corda-gold to-yellow-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.round(Object.values(tabCompletion).reduce((a, b) => a + b, 0) / Object.keys(tabCompletion).length)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-morphism rounded-2xl p-8"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Bestätigung für Sterbefall anlegen */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-corda-gold/10 p-8 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-corda-gold/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-corda-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sterbefall anlegen</h3>
                <p className="text-gray-400 text-sm">Bestätigen Sie diese Aktion</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                Sind Sie sicher, dass Sie diesen Sterbefall anlegen möchten? 
                Nach dem Anlegen wird der Sterbefall offiziell erfasst und eine 
                Sterbefall-Akte wird erstellt.
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmDialog(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Abbrechen
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmCreateSterbefall}
                className="px-6 py-3 bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:shadow-corda-gold/25 transition-all duration-200"
              >
                Sterbefall anlegen
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Sterbefall Vorschau */}
      <SterbefallVorschau
        data={{
          auftrag: auftragData,
          verstorbener: verstorbenerData,
          auftraggeber: auftraggeberData,
          ehepartner: ehepartnerData,
          angehoerige: angehoerigeData,
          bestattung: bestattungData,
          posten: postenData,
          fallNummer: `SF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          status: 'ERFASSUNG'
        }}
        isOpen={showVorschau}
        onClose={() => setShowVorschau(false)}
        onConfirm={confirmCreateSterbefall}
      />
    </div>
  )
}

// Tab Components will be defined below...

// Input Component for reusability
function InputField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  options = [],
  className = '',
  icon: Icon,
  onLookup
}: {
  label: string
  value: string | undefined
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'time'
  placeholder?: string
  required?: boolean
  options?: string[]
  className?: string
  icon?: any
  onLookup?: (value: string) => void
}) {
  const baseClasses = "w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        {type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${Icon ? 'pl-12' : ''}`}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={`${baseClasses} ${Icon ? 'pl-12' : ''} resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value)
              if (onLookup && e.target.value.length > 2) {
                onLookup(e.target.value)
              }
            }}
            placeholder={placeholder}
            className={`${baseClasses} ${Icon ? 'pl-12' : ''}`}
          />
        )}
      </div>
    </div>
  )
}

// Universelle Address Autocomplete Komponente (für alle Adresseingaben)
function AddressAutocompleteField({
  label,
  value,
  onChange,
  placeholder = "Adresse eingeben...",
  required = false,
  className = ''
}: {
  label: string
  value?: string
  onChange: (value: string, addressData?: any) => void
  placeholder?: string
  required?: boolean
  className?: string
}) {
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  
  // Ref für outside click detection
  const containerRef = useRef<HTMLDivElement>(null)

  // Synchronize inputValue with prop value
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle outside clicks to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounced search function
  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    setIsLoading(true)
    setIsUsingFallback(false)
    try {
      const response = await fetch('/api/places-autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: query,
          includedPrimaryTypes: ['address'],
          languageCode: 'de',
          regionCode: 'DE'
        })
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      if (data.fallback) setIsUsingFallback(true)
      setSuggestions(data.suggestions || [])
      setShowSuggestions((data.suggestions || []).length > 0)
    } catch (error) {
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => { searchAddresses(inputValue) }, 300)
    return () => clearTimeout(timeoutId)
  }, [inputValue, searchAddresses])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    // Direkt nur den geänderten text weitergeben, das detaillierte Objekt kommt beim Klick
    onChange(newValue)
  }

  const parseAddress = (address: string, secondaryText?: string) => {
    let strasse = '', hausnummer = '', plz = '', ort = '', ortsteil = ''
    const parts = address.split(',').map(p => p.trim())
    
    // Extract street and house number
    if (parts.length > 0) {
      const streetFull = parts[0]
      // Improved regex to handle various address formats
      const streetMatch = streetFull.match(/^(.+?)\s+(\d+\s*[a-zA-Z]?(\s*[-/]\s*\d+\s*[a-zA-Z]?)?)$/)
      if (streetMatch) {
        strasse = streetMatch[1].trim()
        hausnummer = streetMatch[2].trim()
      } else {
        // If no number found, treat the whole string as street
        strasse = streetFull
      }
    }
    
    // Extract city, zip code, and district
    if (parts.length > 1) {
      const cityFull = parts[1]
      // Improved regex to handle city with district
      const cityMatch = cityFull.match(/^(\d{5})\s+([\w\s]+?)(?:\s+\((\w+)\))?$/)
      if (cityMatch) {
        plz = cityMatch[1].trim()
        ort = cityMatch[2].trim()
        ortsteil = cityMatch[3] || ''
      } else {
        ort = cityFull
      }
    }
    
    // Extract district from secondary text if available
    if (!ortsteil && secondaryText) {
      const districtMatch = secondaryText.match(/\(([^)]+)\)/)
      if (districtMatch) {
        ortsteil = districtMatch[1]
      }
    }
    
    return { strasse, hausnummer, plz, ort, ortsteil }
  }

  const handleSuggestionClick = async (suggestion: any) => {
    const displayText = suggestion.text || suggestion.fullText || `${suggestion.mainText} ${suggestion.secondaryText}`
    let addressParts = { strasse: '', hausnummer: '', plz: '', ort: '', ortsteil: '' };

    console.log('=== handleSuggestionClick START ===')
    console.log('Suggestion:', suggestion)
    console.log('Display Text:', displayText)

    if (suggestion.placeId) {
      try {
        const res = await fetch(`/api/places-autocomplete?placeId=${encodeURIComponent(suggestion.placeId)}`)
        if (res.ok) {
          const details = await res.json()
          console.log('Details API Response:', details)
          // Die Details vom Backend sind maßgeblich
          addressParts = {
            strasse: details.strasse || '',
            hausnummer: details.hausnummer || '',
            plz: details.plz || '',
            ort: details.ort || '',
            ortsteil: details.ortsteil || ''
          };
          console.log('AddressParts nach Details:', addressParts)
        } else {
          console.log('Details API failed, fallback to parsing')
          // Fallback auf Frontend-Parsing wenn API-Call fehlschlägt
          addressParts = parseAddress(displayText, suggestion.secondaryText)
        }
      } catch (e) {
        console.error('Details API error:', e)
        // Fallback auf Frontend-Parsing bei Netzwerkfehler etc.
        addressParts = parseAddress(displayText, suggestion.secondaryText)
      }
    } else {
      console.log('No placeId, using parseAddress')
      // Fallback auf Frontend-Parsing wenn keine placeId vorhanden
      addressParts = parseAddress(displayText, suggestion.secondaryText)
    }

    // Erweiterte Parsing-Logik falls die API nicht alle Daten liefert
    if (!addressParts.strasse || !addressParts.hausnummer || !addressParts.plz || !addressParts.ort) {
      console.log('Incomplete data from API, trying enhanced parsing...')
      
      // Parse mainText für Straße und Hausnummer
      const mainText = suggestion.mainText || suggestion.text?.split(',')[0] || ''
      const secondaryText = suggestion.secondaryText || suggestion.text?.split(',').slice(1).join(',').trim() || ''
      
      // Straße und Hausnummer aus mainText extrahieren
      const streetMatch = mainText.match(/^(.+?)\s+(\d+(?:[a-zA-Z]?|[-/]\d+[a-zA-Z]?)?)$/)
      if (streetMatch) {
        addressParts.strasse = streetMatch[1].trim()
        addressParts.hausnummer = streetMatch[2].trim()
      } else {
        addressParts.strasse = mainText
      }
      
      // PLZ, Ort, Ortsteil aus secondaryText extrahieren
      if (secondaryText) {
        console.log('Parsing secondaryText:', secondaryText)
        
        // Bekannte Orte mit PLZ-Mapping für bessere Erkennung
        const knownPlaces: { [key: string]: { plz: string, ort: string, ortsteil?: string } } = {
          'Gebhardshagen': { plz: '38229', ort: 'Salzgitter', ortsteil: 'Gebhardshagen' },
          'Salzgitter-Gebhardshagen': { plz: '38229', ort: 'Salzgitter', ortsteil: 'Gebhardshagen' },
          'Dortmund-Innenstadt-West': { plz: '44137', ort: 'Dortmund', ortsteil: 'Innenstadt-West' },
          'Coesfeld': { plz: '48653', ort: 'Coesfeld' },
          'Oberkrämer-Vehlefanz': { plz: '16727', ort: 'Oberkrämer', ortsteil: 'Vehlefanz' }
        }
        
        // Prüfe zuerst bekannte Orte
        if (knownPlaces[secondaryText]) {
          const place = knownPlaces[secondaryText]
          addressParts.plz = place.plz
          addressParts.ort = place.ort
          if (place.ortsteil) addressParts.ortsteil = place.ortsteil
        } else {
          // Standard-Parsing für "PLZ Ort" oder "Ort-Ortsteil" Format
          const plzOrtMatch = secondaryText.match(/^(\d{5})\s+(.+)$/)
          if (plzOrtMatch) {
            addressParts.plz = plzOrtMatch[1]
            addressParts.ort = plzOrtMatch[2]
          } else {
            // Für Orte ohne PLZ wie "Gebhardshagen"
            if (secondaryText.includes('-')) {
              const parts = secondaryText.split('-')
              addressParts.ort = parts[0]
              addressParts.ortsteil = parts.slice(1).join('-')
            } else {
              // Einzelner Ortsname - könnte Ort oder Ortsteil sein
              addressParts.ort = secondaryText
            }
          }
        }
      }
      
      console.log('After enhanced parsing:', addressParts)
    }
    
    console.log('Final addressParts:', addressParts)
    
    // Immer nur die Straße im Eingabefeld anzeigen
    const valueForField = addressParts.strasse || displayText
    console.log('Value for field:', valueForField)
    
    setInputValue(valueForField)
    setShowSuggestions(false)
    setSuggestions([])
    
    // Gebe die geparsten Teile weiter - WICHTIG: addressParts muss gesetzt sein!
    const dataToPass = { ...suggestion, addressParts }
    console.log('Data to pass to onChange:', dataToPass)
    console.log('=== handleSuggestionClick END ===')
    
    onChange(valueForField, dataToPass)
  }

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={inputValue} /* inputValue wird jetzt durch useEffect mit props.value synchronisiert */
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-5 h-5 border-2 border-corda-gold border-t-transparent rounded-full"></div>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto" style={{ zIndex: 9999 }}>
            {isUsingFallback && (
              <div className="p-2 bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-400 text-xs">
                ⚠️ Offline-Modus: Beispieldaten werden angezeigt
              </div>
            )}
            {suggestions.map((suggestion, index) => {
              const mainText = suggestion.mainText || suggestion.text?.split(',')[0] || 'Unbekannt'
              const secondaryText = suggestion.secondaryText || suggestion.text?.split(',').slice(1).join(',').trim() || ''
              return (
                <div
                  key={suggestion.placeId || index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
                >
                  <div className="text-white font-medium">{mainText}</div>
                  {secondaryText && (
                    <div className="text-gray-400 text-sm mt-1">{secondaryText}</div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Adresse</span>
                    {!isUsingFallback && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Live-Daten</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Auftrag Tab
function AuftragTab({ 
  data, 
  setData, 
  onBestattungsartChange 
}: { 
  data: AuftragData
  setData: (data: AuftragData) => void
  onBestattungsartChange: (bestattungsart: string) => void
}) {
  const updateField = (field: keyof AuftragData, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    
    if (field === 'bestattungsart' && value) {
      onBestattungsartChange(value)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <FileText className="w-8 h-8 text-corda-gold" />
        <div>
          <h2 className="text-2xl font-bold text-white">Auftrag</h2>
          <p className="text-gray-400">Grundlegende Auftragsinformationen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Sachbearbeiter"
          value={data.sachbearbeiter}
          onChange={(value) => updateField('sachbearbeiter', value)}
          type="select"
          options={['Max Mustermann', 'Anna Schmidt', 'Thomas Weber']}
          required
          icon={User}
        />

        <InputField
          label="Filiale"
          value={data.filiale}
          onChange={(value) => updateField('filiale', value)}
          type="select"
          options={['Hauptsitz', 'Filiale Nord', 'Filiale Süd']}
          required
          icon={Building}
        />

        <div className="col-span-full">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hatVorsorge}
              onChange={(e) => updateField('hatVorsorge', e.target.checked)}
              className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
            />
            <span className="text-white font-medium">Vorsorge vorhanden</span>
          </label>
        </div>

        {data.hatVorsorge && (
          <InputField
            label="Vorsorge-Nummer"
            value={data.vorsorgeNummer}
            onChange={(value) => updateField('vorsorgeNummer', value)}
            placeholder="VS-2024-001"
            icon={Search}
          />
        )}

        <InputField
          label="Bestattungsart"
          value={data.bestattungsart}
          onChange={(value) => updateField('bestattungsart', value)}
          type="select"
          options={BESTATTUNGSARTEN}
          required
          icon={Church}
        />
      </div>
    </div>
  )
}

// Einheitliche Akte-Modal Komponente
function AktenModal({
  isOpen,
  onClose,
  onLoadAktenDaten,
  defaultPersonType,
  title,
  searchPlaceholder = "Nach Akte suchen..."
}: {
  isOpen: boolean
  onClose: () => void
  onLoadAktenDaten: (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => void
  defaultPersonType: 'verstorbener' | 'auftraggeber' | 'ehepartner'
  title: string
  searchPlaceholder?: string
}) {
  const [aktenSuchterm, setAktenSuchterm] = useState('')
  const [selectedPersonType, setSelectedPersonType] = useState<'verstorbener' | 'auftraggeber' | 'ehepartner'>(defaultPersonType)
  
  // Beispiel-Aktendaten (später aus API)
  const [aktenEintraege] = useState<AktenEintragData[]>([
    {
      id: '1',
      typ: 'verstorbener',
      name: 'Max Mustermann',
      verstorbenAm: '2024-01-15',
      bestattungsdaten: {
        bestattungsart: 'Erdbestattung',
        friedhofMeer: 'Hauptfriedhof Musterstadt',
        mitFeier: true
      },
      verstorbenerDaten: {
        anrede: 'Herr',
        vornamen: 'Max',
        nachname: 'Mustermann',
        geburtsdatum: '1950-05-15',
        verstorbenAm: '2024-01-15',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verheiratet',
        konfession: 'evangelisch'
      },
      auftraggeberDaten: {
        anrede: 'Frau',
        vornamen: 'Maria',
        nachname: 'Mustermann',
        geburtsdatum: '1955-08-20',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        telefon: '0123 456789',
        email: 'maria.mustermann@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verwitwet',
        konfession: 'evangelisch',
        beziehung: 'Ehepartner/in'
      },
      ehepartnerDaten: {
        anrede: 'Frau',
        vornamen: 'Maria',
        nachname: 'Mustermann',
        geburtsdatum: '1955-08-20',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verwitwet',
        konfession: 'evangelisch'
      }
    },
    {
      id: '2',
      typ: 'verstorbener',
      name: 'Anna Schmidt',
      verstorbenAm: '2024-02-20',
      bestattungsdaten: {
        bestattungsart: 'Feuerbestattung',
        mitFeier: true
      },
      verstorbenerDaten: {
        anrede: 'Frau',
        vornamen: 'Anna',
        nachname: 'Schmidt',
        geburtsdatum: '1940-12-03',
        verstorbenAm: '2024-02-20',
        strasse: 'Gartenweg',
        hausnummer: '45',
        plz: '31134',
        ort: 'Hildesheim',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'ledig',
        konfession: 'katholisch'
      },
      auftraggeberDaten: {
        anrede: 'Herr',
        vornamen: 'Peter',
        nachname: 'Schmidt',
        geburtsdatum: '1965-03-12',
        strasse: 'Neue Straße',
        hausnummer: '78',
        plz: '31134',
        ort: 'Hildesheim',
        telefon: '05121 987654',
        email: 'peter.schmidt@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verheiratet',
        konfession: 'katholisch',
        beziehung: 'Kind'
      }
    },
    {
      id: '3',
      typ: 'vorsorge',
      name: 'Klaus Weber',
      bestattungsdaten: {
        bestattungsart: 'Seebestattung',
        mitFeier: false
      },
      verstorbenerDaten: {
        anrede: 'Herr',
        vornamen: 'Klaus',
        nachname: 'Weber',
        geburtsdatum: '1960-07-30',
        strasse: 'Seestraße',
        hausnummer: '12',
        plz: '31135',
        ort: 'Hildesheim',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'geschieden',
        konfession: 'konfessionslos'
      },
      auftraggeberDaten: {
        anrede: 'Herr',
        vornamen: 'Klaus',
        nachname: 'Weber',
        geburtsdatum: '1960-07-30',
        strasse: 'Seestraße',
        hausnummer: '12',
        plz: '31135',
        ort: 'Hildesheim',
        telefon: '05121 555666',
        email: 'klaus.weber@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'geschieden',
        konfession: 'konfessionslos',
        beziehung: 'Selbst'
      },
      ehepartnerDaten: {
        anrede: 'Frau',
        vornamen: 'Sabine',
        nachname: 'Weber',
        geburtsdatum: '1962-11-15',
        strasse: 'Bergstraße',
        hausnummer: '34',
        plz: '31135',
        ort: 'Hildesheim',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'geschieden',
        konfession: 'evangelisch'
      }
    }
  ])

  const gefilterteAkten = aktenEintraege.filter(eintrag =>
    eintrag.name.toLowerCase().includes(aktenSuchterm.toLowerCase()) ||
    eintrag.typ.toLowerCase().includes(aktenSuchterm.toLowerCase())
  )

  const handleClose = () => {
    setAktenSuchterm('')
    setSelectedPersonType(defaultPersonType)
    onClose()
  }

  const handleLoadAktenDaten = (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => {
    onLoadAktenDaten(aktenEintrag, personType)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Suchfeld */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={aktenSuchterm}
              onChange={(e) => setAktenSuchterm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Personentyp-Auswahl */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Daten übernehmen von:
          </label>
          <div className="flex space-x-4">
            {(['verstorbener', 'auftraggeber', 'ehepartner'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPersonType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPersonType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'verstorbener' ? 'Verstorbener' : 
                 type === 'auftraggeber' ? 'Auftraggeber' : 'Ehepartner'}
              </button>
            ))}
          </div>
        </div>

        {/* Akten-Liste */}
        <div className="space-y-3">
          {gefilterteAkten.map((akte) => {
            const personData = selectedPersonType === 'verstorbener' ? akte.verstorbenerDaten :
                             selectedPersonType === 'auftraggeber' ? akte.auftraggeberDaten :
                             akte.ehepartnerDaten

            if (!personData || (selectedPersonType === 'ehepartner' && !akte.ehepartnerDaten)) {
              return null
            }

            return (
              <div
                key={`${akte.id}-${selectedPersonType}`}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600 hover:border-blue-500"
                onClick={() => handleLoadAktenDaten(akte, selectedPersonType)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {akte.name}
                        </h4>
                        <p className="text-sm text-gray-300">
                          {akte.typ === 'verstorbener' ? 'Sterbefall' : 
                           akte.typ === 'vorsorge' ? 'Vorsorge' : 'Anfrage'}
                          {akte.verstorbenAm && ` • ${new Date(akte.verstorbenAm).toLocaleDateString('de-DE')}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {selectedPersonType === 'verstorbener' ? 'Verstorbener' : 
                           selectedPersonType === 'auftraggeber' ? 'Auftraggeber' : 'Ehepartner'}:
                        </p>
                        <p className="text-sm text-gray-300">
                          {personData.vornamen} {personData.nachname}
                        </p>
                        {personData.geburtsdatum && (
                          <p className="text-xs text-gray-400">
                            *{new Date(personData.geburtsdatum).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                </div>
              </div>
            )
          })}
          
          {gefilterteAkten.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Keine Akten gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Verstorbener Tab
function VerstorbenerTab({ 
  data, 
  setData, 
  onAddressLookup 
}: { 
  data: PersonData
  setData: (data: PersonData) => void
  onAddressLookup: (query: string, targetSetter: any) => void
}) {
  const [showAktenModal, setShowAktenModal] = useState(false)

  const loadAktenDaten = (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => {
    let personData: PersonData
    
    switch (personType) {
      case 'verstorbener':
        personData = aktenEintrag.verstorbenerDaten
        break
      case 'auftraggeber':
        personData = aktenEintrag.auftraggeberDaten
        break
      case 'ehepartner':
        personData = aktenEintrag.ehepartnerDaten || {}
        break
      default:
        return
    }
    
    setData({ ...data, ...personData })
    setShowAktenModal(false)
  }
  const updateField = (field: keyof PersonData, value: any) => {
    const newData = { ...data, [field]: value }
    
    // Automatische Berechnung des Alters bei Geburtsdatum-Änderung
    if (field === 'geburtsdatum' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1
      }
      newData.alter = age
      
      // Automatische Generierung der Geburtenregisternummer
      const year = birthDate.getFullYear()
      const currentPrefix = data.geburtenregisternummerPrefix?.replace(/^G/, '').replace(/\/\d{4}$/, '') || ''
      // Nur Jahr aktualisieren wenn bereits eine Nummer eingegeben wurde
      if (currentPrefix.trim()) {
        newData.geburtenregisternummerPrefix = `G${currentPrefix}/${year}`
      }
    }
    
    // Automatische Übernahme Geburtsort -> Geburtsstandesamt
    if (field === 'geburtsort' && value) {
      newData.geburtsStandesamt = value
    }
    
    // Automatische Generierung der Sterberegisternummer bei Sterbedatum
    if ((field === 'verstorbenAm' || field === 'aufgefundenAm') && value) {
      const year = new Date(value).getFullYear()
      const currentPrefix = data.sterberegisternummerPrefix?.replace(/^S/, '').replace(/\/\d{4}$/, '') || ''
      // Nur Jahr aktualisieren wenn bereits eine Nummer eingegeben wurde
      if (currentPrefix.trim()) {
        newData.sterberegisternummerPrefix = `S${currentPrefix}/${year}`
      }
    }
    
    // Automatische Übernahme Sterbeort -> Standesamt
    if (field === 'sterbeortOrt' && value) {
      newData.standesamt = value
    }
    
    setData(newData)
  }

  // Vornamen für Rufname-Dropdown extrahieren
  const getVornamenOptions = () => {
    if (!data.vornamen) return []
    return data.vornamen.split(' ').filter(name => name.trim() !== '')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <User className="w-8 h-8 text-corda-gold" />
          <div>
            <h2 className="text-2xl font-bold text-white">Verstorbener</h2>
            <p className="text-gray-400">Persönliche Daten der verstorbenen Person</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAktenModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Aus Akte übernehmen</span>
        </button>
      </div>

      {/* Persönliche Daten */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Persönliche Daten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Anrede"
            value={data.anrede}
            onChange={(value) => updateField('anrede', value)}
            type="select"
            options={ANREDEN}
            required
          />
          
          <InputField
            label="Titel"
            value={data.titel}
            onChange={(value) => updateField('titel', value)}
            type="select"
            options={TITEL}
            placeholder="Titel auswählen"
          />
          
          <InputField
            label="Vornamen"
            value={data.vornamen}
            onChange={(value) => {
              // Sichere Updates ohne Endlos-Loop
              const newData = { ...data, vornamen: value }
              
              // Ersten Vornamen automatisch als Rufname setzen
              if (value && value.trim()) {
                const firstVorname = value.trim().split(' ')[0]
                newData.rufname = firstVorname
              } else {
                newData.rufname = ''
              }
              
              setData(newData)
            }}
            placeholder="Alle Vornamen"
            required
          />
          
          <InputField
            label="Rufname"
            value={data.rufname}
            onChange={(value) => updateField('rufname', value)}
            type="select"
            options={getVornamenOptions()}
            placeholder="Rufname auswählen"
          />
          
          <InputField
            label="Nachname"
            value={data.nachname}
            onChange={(value) => updateField('nachname', value)}
            placeholder="Familienname"
            required
          />
          
          <InputField
            label="Geburtsname"
            value={data.geburtsname}
            onChange={(value) => updateField('geburtsname', value)}
            placeholder="Falls abweichend"
          />
          
          <InputField
            label="Staatsangehörigkeit"
            value={data.staatsangehoerigkeit}
            onChange={(value) => updateField('staatsangehoerigkeit', value)}
            type="select"
            options={STAATSANGEHOERIGKEITEN}
          />
          
          <InputField
            label="Familienstand"
            value={data.familienstand}
            onChange={(value) => updateField('familienstand', value)}
            type="select"
            options={FAMILIENSTAENDE}
          />
          
          <InputField
            label="Konfession"
            value={data.konfession}
            onChange={(value) => updateField('konfession', value)}
            type="select"
            options={KONFESSIONEN}
          />
          
          {data.konfession === 'andere' && (
            <InputField
              label="Konfession (individuell)"
              value={data.individuellKonfession}
              onChange={(value) => updateField('individuellKonfession', value)}
              placeholder="Bitte spezifizieren..."
            />
          )}
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-corda-gold" />
          <span>Adresse</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <AddressAutocompleteField
              label="Straße"
              value={data.strasse}
              onChange={(value, addressData) => {
                console.log('AddressAutocompleteField onChange called with:', { value, addressData })
                if (addressData?.addressParts) {
                  console.log('Setting all address fields:', addressData.addressParts)
                  // Alle Adressfelder in einem einzigen Update setzen
                  setData({ 
                    ...data, 
                    strasse: addressData.addressParts.strasse,
                    hausnummer: addressData.addressParts.hausnummer,
                    plz: addressData.addressParts.plz,
                    ort: addressData.addressParts.ort,
                    ortsteil: addressData.addressParts.ortsteil
                  })
                } else {
                  console.log('Only setting street field:', value)
                  updateField('strasse', value)
                }
              }}
              placeholder="Straße eingeben..."
            />
          </div>
          <InputField
            label="Hausnummer"
            value={data.hausnummer}
            onChange={(value) => updateField('hausnummer', value)}
            placeholder="Nr."
          />
          <InputField
            label="PLZ"
            value={data.plz}
            onChange={(value) => updateField('plz', value)}
            placeholder="12345"
          />
          <InputField
            label="Ort"
            value={data.ort}
            onChange={(value) => updateField('ort', value)}
            placeholder="Stadt/Gemeinde"
          />
          <InputField
            label="Ortsteil"
            value={data.ortsteil}
            onChange={(value) => updateField('ortsteil', value)}
            placeholder="Ortsteil"
          />
        </div>
      </div>

      {/* Geburt */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Geburt</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Geburtsdatum"
            value={data.geburtsdatum}
            onChange={(value) => updateField('geburtsdatum', value)}
            type="date"
            required
            icon={Calendar}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Alter</label>
            <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-300">
              {data.alter ? `${data.alter} Jahre` : 'Automatisch berechnet'}
            </div>
          </div>
          
          <InputField
            label="Geburtsort"
            value={data.geburtsort}
            onChange={(value) => updateField('geburtsort', value)}
            placeholder="Stadt"
          />
          
          <InputField
            label="Geburts-Standesamt"
            value={data.geburtsStandesamt}
            onChange={(value) => updateField('geburtsStandesamt', value)}
            placeholder="Automatisch aus Geburtsort"
          />
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Geburtenregisternummer
            </label>
            <div className="flex items-center space-x-1">
              <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">G</span>
              <input
                type="text"
                value={data.geburtenregisternummerPrefix?.replace(/^G/, '').replace(/\/\d{4}$/, '') || ''}
                onChange={(e) => {
                  const year = data.geburtsdatum ? new Date(data.geburtsdatum).getFullYear() : new Date().getFullYear()
                  updateField('geburtenregisternummerPrefix', `G${e.target.value}/${year}`)
                }}
                placeholder="123"
                maxLength={4}
                className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
              />
              <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                /{data.geburtsdatum ? new Date(data.geburtsdatum).getFullYear() : 'JJJJ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tod */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tod</h3>
        <div className="space-y-4">
          {/* Todeszeit-Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Todeszeit-Art"
              value={data.todeszeitraum || 'verstorben'}
              onChange={(value) => updateField('todeszeitraum', value)}
              type="select"
              options={['verstorben', 'aufgefunden', 'zeitraum']}
              required
            />
          </div>
          
          {/* Verstorben am */}
          {(!data.todeszeitraum || data.todeszeitraum === 'verstorben') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Verstorben am"
                value={data.verstorbenAm}
                onChange={(value) => updateField('verstorbenAm', value)}
                type="date"
                required
                icon={Calendar}
              />
              <InputField
                label="Uhrzeit"
                value={data.verstorbenZeit}
                onChange={(value) => updateField('verstorbenZeit', value)}
                type="time"
                placeholder="Optional"
                icon={Clock}
              />
            </div>
          )}
          
          {/* Aufgefunden am */}
          {data.todeszeitraum === 'aufgefunden' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Aufgefunden am"
                value={data.aufgefundenAm}
                onChange={(value) => updateField('aufgefundenAm', value)}
                type="date"
                required
                icon={Calendar}
              />
              <InputField
                label="Uhrzeit"
                value={data.aufgefundenZeit}
                onChange={(value) => updateField('aufgefundenZeit', value)}
                type="time"
                placeholder="Optional"
                icon={Clock}
              />
            </div>
          )}
          
          {/* Todeszeitraum */}
          {data.todeszeitraum === 'zeitraum' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Von Datum"
                  value={data.todeszeitraumVon}
                  onChange={(value) => updateField('todeszeitraumVon', value)}
                  type="date"
                  required
                  icon={Calendar}
                />
                <InputField
                  label="Von Uhrzeit"
                  value={data.todeszeitraumVonZeit}
                  onChange={(value) => updateField('todeszeitraumVonZeit', value)}
                  type="time"
                  icon={Clock}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bis Datum"
                  value={data.todeszeitraumBis}
                  onChange={(value) => updateField('todeszeitraumBis', value)}
                  type="date"
                  required
                  icon={Calendar}
                />
                <InputField
                  label="Bis Uhrzeit"
                  value={data.todeszeitraumBisZeit}
                  onChange={(value) => updateField('todeszeitraumBisZeit', value)}
                  type="time"
                  icon={Clock}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Todesart"
              value={data.todesart}
              onChange={(value) => {
                // Sichere State-Updates ohne Konflikte
                const newData = { ...data, todesart: value }
                
                // Bei unnatürlichem Tod automatisch Staatsanwaltschaft aktivieren
                if (value === 'unnatürlicher Tod') {
                  newData.staatsanwaltschaftEingeschaltet = true
                }
                
                setData(newData)
              }}
              type="select"
              options={TODESARTEN}
              placeholder="Todesart auswählen"
            />
            
            {/* Bei unnatürlichem Tod - Hinweis */}
            {data.todesart === 'unnatürlicher Tod' && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-medium">
                    Staatsanwaltschaft automatisch aktiviert
                  </span>
                </div>
                <p className="text-orange-300 text-sm mt-2">
                  Bei unnatürlichem Tod werden die Staatsanwaltschaft-Felder automatisch in den "Besonderen Umständen" aktiviert.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sterbeort */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sterbeort</h3>
        <div className="space-y-4">
          <InputField
            label="Sterbeort-Typ"
            value={data.sterbeort}
            onChange={(value) => {
              updateField('sterbeort', value)
              // Bei "Eigene Wohnung" Standesamt automatisch setzen
              if (value === 'Eigene Wohnung' && data.ort) {
                updateField('standesamt', data.ort)
                // Automatisch Verstorbenen-Adresse übernehmen
                updateField('sterbeortStrasse', data.strasse)
                updateField('sterbeortHausnummer', data.hausnummer)
                updateField('sterbeortPlz', data.plz)
                updateField('sterbeortOrt', data.ort)
                updateField('sterbeortOrtsteil', data.ortsteil)
              }
            }}
            type="select"
            options={STERBEORTE}
            required
          />
          
          {data.sterbeort && data.sterbeort !== 'Eigene Wohnung' && (
            <SterbeortAutocompleteField
              sterbeortTyp={data.sterbeort}
              value={data.sterbeortDetails}
              onChange={(value, addressData) => {
                console.log('SterbeortAutocompleteField onChange called with:', { value, addressData })
                if (addressData?.addressParts) {
                  setData({ 
                    ...data, 
                    sterbeortDetails: value,
                    sterbeortStrasse: addressData.addressParts.strasse,
                    sterbeortHausnummer: addressData.addressParts.hausnummer,
                    sterbeortPlz: addressData.addressParts.plz,
                    sterbeortOrt: addressData.addressParts.ort,
                    sterbeortOrtsteil: addressData.addressParts.ortsteil,
                    standesamt: addressData.addressParts.ort // Automatisch Standesamt setzen
                  })
                } else {
                  updateField('sterbeortDetails', value)
                }
              }}
              verstorbenerAdresse={data}
              placeholder={`${data.sterbeort} eingeben...`}
            />
          )}
          
          {/* Sterbeort-Adresse */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <InputField
                label="Straße"
                value={data.sterbeortStrasse}
                onChange={(value) => updateField('sterbeortStrasse', value)}
                placeholder={data.sterbeort === 'Eigene Wohnung' ? 'Automatisch übernommen' : 'Straße'}
                className={data.sterbeort === 'Eigene Wohnung' ? 'opacity-60' : ''}
              />
            </div>
            <InputField
              label="Hausnummer"
              value={data.sterbeortHausnummer}
              onChange={(value) => updateField('sterbeortHausnummer', value)}
              placeholder="Nr."
              className={data.sterbeort === 'Eigene Wohnung' ? 'opacity-60' : ''}
            />
            <InputField
              label="PLZ"
              value={data.sterbeortPlz}
              onChange={(value) => updateField('sterbeortPlz', value)}
              placeholder="12345"
              className={data.sterbeort === 'Eigene Wohnung' ? 'opacity-60' : ''}
            />
            <InputField
              label="Ort"
              value={data.sterbeortOrt}
              onChange={(value) => {
                updateField('sterbeortOrt', value)
                // Automatisch Standesamt setzen
                updateField('standesamt', value)
              }}
              placeholder="Stadt/Gemeinde"
              className={data.sterbeort === 'Eigene Wohnung' ? 'opacity-60' : ''}
            />
            <InputField
              label="Ortsteil"
              value={data.sterbeortOrtsteil}
              onChange={(value) => updateField('sterbeortOrtsteil', value)}
              placeholder="Ortsteil"
              className={data.sterbeort === 'Eigene Wohnung' ? 'opacity-60' : ''}
            />
          </div>
        </div>
      </div>

      {/* Standesamt und Registernummer */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Standesamt</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Standesamt"
            value={data.standesamt}
            onChange={(value) => updateField('standesamt', value)}
            placeholder="Automatisch aus Sterbeort"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sterberegisternummer
            </label>
            <div className="flex items-center space-x-1">
              <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">S</span>
              <input
                type="text"
                value={data.sterberegisternummerPrefix?.replace(/^S/, '').replace(/\/\d{4}$/, '') || ''}
                onChange={(e) => {
                  const year = data.verstorbenAm ? new Date(data.verstorbenAm).getFullYear() : new Date().getFullYear()
                  updateField('sterberegisternummerPrefix', `S${e.target.value}/${year}`)
                }}
                placeholder="123"
                maxLength={4}
                className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
              />
              <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                /{data.verstorbenAm ? new Date(data.verstorbenAm).getFullYear() : 'JJJJ'}
              </span>
            </div>
          </div>
          
          <InputField
            label="Arzt"
            value={data.arzt}
            onChange={(value) => updateField('arzt', value)}
            placeholder="Behandelnder Arzt"
          />
        </div>
      </div>

      {/* Infektiös und Staatsanwaltschaft */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Besondere Umstände</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.infektios || false}
              onChange={(e) => updateField('infektios', e.target.checked)}
              className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
            />
            <span className="text-white">Infektiös</span>
          </div>
          
          {data.infektios && (
            <InputField
              label="Infektionskrankheit"
              value={data.infektionskrankheit}
              onChange={(value) => updateField('infektionskrankheit', value)}
              type="select"
              options={INFEKTIONSKRANKHEITEN}
            />
          )}
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.staatsanwaltschaftEingeschaltet || false}
              onChange={(e) => updateField('staatsanwaltschaftEingeschaltet', e.target.checked)}
              className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
            />
            <span className="text-white">Staatsanwaltschaft eingeschaltet?</span>
          </div>
          
          {data.staatsanwaltschaftEingeschaltet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Polizeistation"
                value={data.polizeistation}
                onChange={(value) => updateField('polizeistation', value)}
                placeholder="Zuständige Polizeistation"
              />
              
              <InputField
                label="Staatsanwaltschaft"
                value={data.staatsanwaltschaft}
                onChange={(value) => updateField('staatsanwaltschaft', value)}
                placeholder="Zuständige Staatsanwaltschaft"
              />
              
              <InputField
                label="Staatsanwaltschaft Aktenzeichen"
                value={data.staatsanwaltschaftAktenzeichen}
                onChange={(value) => updateField('staatsanwaltschaftAktenzeichen', value)}
                placeholder="Az.: 123 Js 456/24"
                required={data.todesart === 'unnatürlicher Tod'}
              />
              
              <div className="md:col-span-2">
                <ObduktionsortAutocompleteField
                  label="Obduktionsort"
                  value={data.obduktionsort}
                  onChange={(value, addressData) => {
                    if (addressData?.addressParts) {
                      // Nur den Namen der Einrichtung speichern, nicht die vollständige Adresse
                      updateField('obduktionsort', value)
                    } else {
                      updateField('obduktionsort', value)
                    }
                  }}
                  placeholder="Klinik/Institut suchen..."
                />
              </div>
              
              <InputField
                label="Leichenfreigabe"
                value={data.leichenfreigabe}
                onChange={(value) => updateField('leichenfreigabe', value)}
                type="select"
                options={LEICHENFREIGABE_OPTIONEN}
              />
              
              {data.leichenfreigabe === 'Leichnahm freigegeben' && (
                <InputField
                  label="Freigabe-Datum"
                  value={data.leichenfreigabeDatum}
                  onChange={(value) => updateField('leichenfreigabeDatum', value)}
                  type="date"
                  icon={Calendar}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bemerkungen */}
      <InputField
        label="Bemerkungen"
        value={data.bemerkungen}
        onChange={(value) => updateField('bemerkungen', value)}
        type="textarea"
        placeholder="Zusätzliche Informationen..."
      />

      {/* Aus Akte übernehmen Modal */}
      <AktenModal
        isOpen={showAktenModal}
        onClose={() => setShowAktenModal(false)}
        onLoadAktenDaten={loadAktenDaten}
        defaultPersonType="verstorbener"
        title="Daten aus Akte übernehmen"
      />
    </div>
  )
}

// Auftraggeber Tab
function AuftraggeberTab({ 
  data, 
  setData, 
  onCopyFromVerstorbener, 
  onAddressLookup 
}: { 
  data: PersonData
  setData: (data: PersonData) => void
  onCopyFromVerstorbener: () => void
  onAddressLookup: (query: string, targetSetter: any) => void
}) {
  const [showAktenModal, setShowAktenModal] = useState(false)

  const loadAktenDaten = (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => {
    let personData: PersonData
    
    switch (personType) {
      case 'verstorbener':
        personData = aktenEintrag.verstorbenerDaten
        break
      case 'auftraggeber':
        personData = aktenEintrag.auftraggeberDaten
        break
      case 'ehepartner':
        personData = aktenEintrag.ehepartnerDaten || {}
        break
      default:
        return
    }
    
    setData({ ...data, ...personData })
    setShowAktenModal(false)
  }

  const updateField = (field: keyof PersonData, value: any) => {
    setData({ ...data, [field]: value })
  }

  // State für zusätzliche Telefonnummern mit Bezeichnung
  const [zusatzTelefon, setZusatzTelefon] = useState<{telefon: string, bezeichnung: string}[]>([])
  
  const addTelefon = () => {
    setZusatzTelefon([...zusatzTelefon, { telefon: '', bezeichnung: '' }])
  }
  
  const updateZusatzTelefon = (index: number, field: 'telefon' | 'bezeichnung', value: string) => {
    const newTelefone = [...zusatzTelefon]
    newTelefone[index][field] = value
    setZusatzTelefon(newTelefone)
  }
  
  const removeZusatzTelefon = (index: number) => {
    setZusatzTelefon(zusatzTelefon.filter((_, i) => i !== index))
  }

  // State für zusätzliche E-Mails mit Bezeichnung
  const [zusatzEmail, setZusatzEmail] = useState<{email: string, bezeichnung: string}[]>([])
  
  const addEmail = () => {
    setZusatzEmail([...zusatzEmail, { email: '', bezeichnung: '' }])
  }
  
  const updateZusatzEmail = (index: number, field: 'email' | 'bezeichnung', value: string) => {
    const newEmails = [...zusatzEmail]
    newEmails[index][field] = value
    setZusatzEmail(newEmails)
  }
  
  const removeZusatzEmail = (index: number) => {
    setZusatzEmail(zusatzEmail.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Users className="w-8 h-8 text-corda-gold" />
          <div>
            <h2 className="text-2xl font-bold text-white">Auftraggeber</h2>
            <p className="text-gray-400">Person, die den Auftrag erteilt</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopyFromVerstorbener}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Nachname & Adresse übernehmen</span>
          </motion.button>
          
          <button
            onClick={() => setShowAktenModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Aus Akte übernehmen</span>
          </button>
        </div>
      </div>

      {/* Persönliche Daten */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Persönliche Daten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Anrede"
            value={data.anrede}
            onChange={(value) => updateField('anrede', value)}
            type="select"
            options={ANREDEN}
            required
          />
          
          <InputField
            label="Titel"
            value={data.titel}
            onChange={(value) => updateField('titel', value)}
            type="select"
            options={TITEL}
          />
          
          <InputField
            label="Vornamen"
            value={data.vornamen}
            onChange={(value) => {
              // Sichere Updates ohne Endlos-Loop
              const newData = { ...data, vornamen: value }
              
              // Ersten Vornamen automatisch als Rufname setzen
              if (value && value.trim()) {
                const firstVorname = value.trim().split(' ')[0]
                newData.rufname = firstVorname
              } else {
                newData.rufname = ''
              }
              
              setData(newData)
            }}
            placeholder="Alle Vornamen"
            required
          />
          
          <InputField
            label="Nachname"
            value={data.nachname}
            onChange={(value) => updateField('nachname', value)}
            placeholder="Nachname"
            required
          />
          
          <InputField
            label="Beziehung zum Verstorbenen"
            value={data.beziehung}
            onChange={(value) => updateField('beziehung', value)}
            type="select"
            options={BEZIEHUNGEN}
            required
          />
          
          <InputField
            label="Staatsangehörigkeit"
            value={data.staatsangehoerigkeit}
            onChange={(value) => updateField('staatsangehoerigkeit', value)}
            type="select"
            options={STAATSANGEHOERIGKEITEN}
          />
        </div>
      </div>

      {/* Kontakt */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Kontaktdaten</h3>
        <div className="space-y-6">
          {/* Hauptkontakt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Telefon/Mobil (Hauptnummer)"
              value={data.telefon}
              onChange={(value) => updateField('telefon', value)}
              type="tel"
              placeholder="+49 123 456789"
              required
              icon={Phone}
            />
            
            <InputField
              label="E-Mail (Haupt-E-Mail)"
              value={data.email}
              onChange={(value) => updateField('email', value)}
              type="email"
              placeholder="email@beispiel.de"
              icon={Mail}
            />
          </div>
          
          {/* Zusätzliche Telefonnummern */}
          {zusatzTelefon.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Weitere Telefonnummern</h4>
              {zusatzTelefon.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bezeichnung</label>
                    <input
                      type="text"
                      value={item.bezeichnung}
                      onChange={(e) => updateZusatzTelefon(index, 'bezeichnung', e.target.value)}
                      placeholder="z.B. Schwester, Arbeit, Mobil"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Telefonnummer</label>
                    <input
                      type="tel"
                      value={item.telefon}
                      onChange={(e) => updateZusatzTelefon(index, 'telefon', e.target.value)}
                      placeholder="+49 123 456789"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => removeZusatzTelefon(index)}
                      className="text-red-400 hover:text-red-300 p-2 transition-colors"
                      title="Telefonnummer entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addTelefon}
            className="w-full bg-gray-700/50 border border-dashed border-gray-600 rounded-xl p-3 text-gray-400 hover:text-white hover:border-corda-gold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Weitere Telefonnummer hinzufügen</span>
          </motion.button>

          {/* Zusätzliche E-Mails */}
          {zusatzEmail.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Weitere E-Mail-Adressen</h4>
              {zusatzEmail.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bezeichnung</label>
                    <input
                      type="text"
                      value={item.bezeichnung}
                      onChange={(e) => updateZusatzEmail(index, 'bezeichnung', e.target.value)}
                      placeholder="z.B. Privat, Arbeit, Partner"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">E-Mail-Adresse</label>
                    <input
                      type="email"
                      value={item.email}
                      onChange={(e) => updateZusatzEmail(index, 'email', e.target.value)}
                      placeholder="email@beispiel.de"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => removeZusatzEmail(index)}
                      className="text-red-400 hover:text-red-300 p-2 transition-colors"
                      title="E-Mail entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addEmail}
            className="w-full bg-gray-700/50 border border-dashed border-gray-600 rounded-xl p-3 text-gray-400 hover:text-white hover:border-corda-gold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Weitere E-Mail-Adresse hinzufügen</span>
          </motion.button>
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-corda-gold" />
          <span>Adresse</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <AddressAutocompleteField
              label="Straße"
              value={data.strasse}
              onChange={(value, addressData) => {
                console.log('AddressAutocompleteField onChange called with:', { value, addressData })
                if (addressData?.addressParts) {
                  console.log('Setting all address fields:', addressData.addressParts)
                  // Alle Adressfelder in einem einzigen Update setzen
                  setData({ 
                    ...data, 
                    strasse: addressData.addressParts.strasse,
                    hausnummer: addressData.addressParts.hausnummer,
                    plz: addressData.addressParts.plz,
                    ort: addressData.addressParts.ort,
                    ortsteil: addressData.addressParts.ortsteil
                  })
                } else {
                  console.log('Only setting street field:', value)
                  updateField('strasse', value)
                }
              }}
              placeholder="Straße eingeben..."
            />
          </div>
          <InputField
            label="Hausnummer"
            value={data.hausnummer}
            onChange={(value) => updateField('hausnummer', value)}
            placeholder="Nr."
          />
          <InputField
            label="PLZ"
            value={data.plz}
            onChange={(value) => updateField('plz', value)}
            placeholder="12345"
          />
          <InputField
            label="Ort"
            value={data.ort}
            onChange={(value) => updateField('ort', value)}
            placeholder="Stadt/Gemeinde"
          />
          <InputField
            label="Ortsteil"
            value={data.ortsteil}
            onChange={(value) => updateField('ortsteil', value)}
            placeholder="Ortsteil"
          />
        </div>
      </div>

      {/* Bankverbindung */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-corda-gold" />
          <span>Bankverbindung</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="IBAN"
            value={data.bankIban}
            onChange={(value) => updateField('bankIban', value)}
            placeholder="DE89 3704 0044 0532 0130 00"
          />
          
          <InputField
            label="BIC"
            value={data.bankBic}
            onChange={(value) => updateField('bankBic', value)}
            placeholder="COBADEFFXXX"
          />
          
          <InputField
            label="Bank"
            value={data.bankName}
            onChange={(value) => updateField('bankName', value)}
            placeholder="Name der Bank"
          />
          
          <InputField
            label="Zahlungsart"
            value={data.zahlungsart}
            onChange={(value) => updateField('zahlungsart', value as 'ueberweisung' | 'lastschrift')}
            type="select"
            options={['Überweisung', 'Lastschrift']}
          />
        </div>
      </div>

      {/* Aus Akte übernehmen Modal */}
      <AktenModal
        isOpen={showAktenModal}
        onClose={() => setShowAktenModal(false)}
        onLoadAktenDaten={loadAktenDaten}
        defaultPersonType="auftraggeber"
        title="Auftraggeberdaten aus Akte übernehmen"
      />
    </div>
  )
}

// Ehepartner Tab
function EhepartnerTab({ 
  data, 
  setData, 
  onCopyFromVerstorbener, 
  onAddressLookup,
  verstorbenerData,
  auftraggeberData
}: { 
  data: PersonData
  setData: (data: PersonData) => void
  onCopyFromVerstorbener: () => void
  onAddressLookup: (query: string, targetSetter: any) => void
  verstorbenerData: PersonData
  auftraggeberData: PersonData
}) {
  const [showAktenModal, setShowAktenModal] = useState(false)

  const loadAktenDaten = (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => {
    let personData: PersonData
    
    switch (personType) {
      case 'verstorbener':
        personData = aktenEintrag.verstorbenerDaten
        break
      case 'auftraggeber':
        personData = aktenEintrag.auftraggeberDaten
        break
      case 'ehepartner':
        personData = aktenEintrag.ehepartnerDaten || {}
        break
      default:
        return
    }
    
    setData({ ...data, ...personData })
    setShowAktenModal(false)
  }

  
  const updateField = (field: keyof PersonData, value: any) => {
    const newData = { ...data, [field]: value }
    
    // Automatische Berechnung des Alters bei Geburtsdatum-Änderung
    if (field === 'geburtsdatum' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const hasHadBirthday = today.getMonth() > birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
      newData.alter = hasHadBirthday ? age : age - 1
    }

    // Automatische Generierung der Eheregisternummer bei Hochzeitsdatum
    if (field === 'hochzeitsdatum' && value) {
      const year = new Date(value).getFullYear()
      const familienstand = verstorbenerData.familienstand || ''
      const prefix = familienstand === 'Eingetragene Lebenspartnerschaft' ? 'L' : 'E'
      const currentPrefix = data.eheregisternummer?.replace(/^[EL]/, '').replace(/\/\d{4}$/, '') || ''
      if (!currentPrefix) {
        newData.eheregisternummer = `${prefix}${Math.floor(Math.random() * 999) + 1}/${year}`
      } else {
        newData.eheregisternummer = `${prefix}${currentPrefix}/${year}`
      }
    }

    // Automatische Übernahme Nachname bei Verheirateten/Verwitweten
    if (!data.nachname && verstorbenerData.nachname && 
        ['Verheiratet', 'Verwitwet', 'Eingetragene Lebenspartnerschaft'].includes(verstorbenerData.familienstand || '')) {
      newData.nachname = verstorbenerData.nachname
    }

    // Automatische Staatsbürgerschaft auf Deutsch
    if (!data.staatsangehoerigkeit) {
      newData.staatsangehoerigkeit = 'deutsch'
    }

    setData(newData)
  }

  // Vornamen für Rufname-Dropdown extrahieren
  const getVornamenOptions = () => {
    if (!data.vornamen) return []
    return data.vornamen.split(' ').filter(name => name.trim() !== '')
  }

  // Automatische Datenübernahme vom Auftraggeber falls dieser Ehepartner ist
  const copyFromAuftraggeber = () => {
    if (auftraggeberData.beziehung === 'Ehepartner/in') {
      const copiedData = {
        anrede: auftraggeberData.anrede,
        titel: auftraggeberData.titel,
        vornamen: auftraggeberData.vornamen,
        rufname: auftraggeberData.rufname,
        nachname: auftraggeberData.nachname,
        geburtsname: auftraggeberData.geburtsname,
        staatsangehoerigkeit: auftraggeberData.staatsangehoerigkeit || 'deutsch',
        strasse: auftraggeberData.strasse,
        hausnummer: auftraggeberData.hausnummer,
        plz: auftraggeberData.plz,
        ort: auftraggeberData.ort,
        ortsteil: auftraggeberData.ortsteil,
        geburtsort: auftraggeberData.geburtsort,
        geburtsdatum: auftraggeberData.geburtsdatum,
        telefon: auftraggeberData.telefon,
        email: auftraggeberData.email
      }
      setData({ ...data, ...copiedData })
    }
  }

  // Automatische Nachname-Übernahme bei verheiratet/verwitwet
  React.useEffect(() => {
    if ((verstorbenerData.familienstand === 'verheiratet' || verstorbenerData.familienstand === 'verwitwet') && 
        verstorbenerData.nachname && !data.nachname) {
      updateField('nachname', verstorbenerData.nachname)
    }
  }, [verstorbenerData.familienstand, verstorbenerData.nachname])

  // Automatische Staatsangehörigkeit auf deutsch setzen
  React.useEffect(() => {
    if (!data.staatsangehoerigkeit) {
      updateField('staatsangehoerigkeit', 'deutsch')
    }
  }, [])

  // Automatische Datenübernahme wenn Auftraggeber Ehepartner ist
  React.useEffect(() => {
    if (auftraggeberData.beziehung === 'Ehepartner/in' && !data.vornamen) {
      copyFromAuftraggeber()
    }
  }, [auftraggeberData.beziehung])

  // Bestimme welche Felder angezeigt werden sollen basierend auf Familienstand
  const showEheFields = verstorbenerData.familienstand === 'verheiratet' || verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft'
  const showScheidungsFields = verstorbenerData.familienstand === 'geschieden'
  const showTodFields = verstorbenerData.familienstand === 'verwitwet'
  
  // Anpassung der Bezeichnung für eingetragene Lebenspartnerschaft
  const partnerBezeichnung = verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Lebenspartner' : 'Ehepartner'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Heart className="w-8 h-8 text-corda-gold" />
          <div>
            <h2 className="text-2xl font-bold text-white">{partnerBezeichnung}</h2>
            <p className="text-gray-400">Daten des {partnerBezeichnung}s</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {auftraggeberData.beziehung === 'Ehepartner/in' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyFromAuftraggeber}
              className="bg-corda-gold hover:bg-corda-gold/80 text-black px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Vom Auftraggeber übernehmen</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopyFromVerstorbener}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Adresse übernehmen</span>
          </motion.button>
          
          <button
            onClick={() => setShowAktenModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Aus Akte übernehmen</span>
          </button>
        </div>
      </div>

      {/* Persönliche Daten */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Persönliche Daten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Anrede"
            value={data.anrede}
            onChange={(value) => updateField('anrede', value)}
            type="select"
            options={ANREDEN}
          />
          
          <InputField
            label="Titel"
            value={data.titel}
            onChange={(value) => updateField('titel', value)}
            type="select"
            options={TITEL}
          />
          
          <InputField
            label="Vornamen"
            value={data.vornamen}
            onChange={(value) => {
              // Sichere Updates ohne Endlos-Loop
              const newData = { ...data, vornamen: value }
              
              // Ersten Vornamen automatisch als Rufname setzen
              if (value && value.trim()) {
                const firstVorname = value.trim().split(' ')[0]
                newData.rufname = firstVorname
              } else {
                newData.rufname = ''
              }
              
              setData(newData)
            }}
            placeholder="Alle Vornamen"
          />
          
          <InputField
            label="Rufname"
            value={data.rufname}
            onChange={(value) => updateField('rufname', value)}
            type="select"
            options={getVornamenOptions()}
            placeholder="Rufname auswählen"
          />
          
          <InputField
            label="Nachname"
            value={data.nachname}
            onChange={(value) => updateField('nachname', value)}
            placeholder="Nachname"
          />
          
          <InputField
            label="Geburtsname"
            value={data.geburtsname}
            onChange={(value) => updateField('geburtsname', value)}
            placeholder="Falls abweichend"
          />
          
          <InputField
            label="Staatsangehörigkeit"
            value={data.staatsangehoerigkeit}
            onChange={(value) => updateField('staatsangehoerigkeit', value)}
            type="select"
            options={STAATSANGEHOERIGKEITEN}
          />
        </div>
      </div>

      {/* Ehe/Partnerschaft - nur bei verheiratet oder eingetragene Lebenspartnerschaft */}
      {showEheFields && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Lebenspartnerschaft' : 'Ehe'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Partnerschaftsdatum' : 'Hochzeitsdatum'}
              value={data.hochzeitsdatum}
              onChange={(value) => updateField('hochzeitsdatum', value)}
              type="date"
              icon={Calendar}
            />
            
            <InputField
              label={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Ort der Partnerschaft' : 'Hochzeitsort'}
              value={data.hochzeitsort}
              onChange={(value) => updateField('hochzeitsort', value)}
              placeholder={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Ort der Partnerschaft' : 'Ort der Eheschließung'}
            />
            
            <InputField
              label="Standesamt"
              value={data.eheStandesamt}
              onChange={(value) => updateField('eheStandesamt', value)}
              placeholder="Automatisch aus Ort"
            />
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {verstorbenerData.familienstand === 'Eingetragene Lebenspartnerschaft' ? 'Partnerschaftsregisternummer' : 'Eheregisternummer'}
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">
                  {verstorbenerData.familienstand === 'Eingetragene Lebenspartnerschaft' ? 'L' : 'E'}
                </span>
                <input
                  type="text"
                  value={data.eheregisternummer?.replace(/^[EL]/, '').replace(/\/\d{4}$/, '') || ''}
                  onChange={(e) => {
                    const year = data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : new Date().getFullYear()
                    const prefix = verstorbenerData.familienstand === 'Eingetragene Lebenspartnerschaft' ? 'L' : 'E'
                    updateField('eheregisternummer', `${prefix}${e.target.value}/${year}`)
                  }}
                  placeholder="123"
                  maxLength={4}
                  className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
                />
                <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                  /{data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : 'JJJJ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheidung - nur bei geschieden */}
      {showScheidungsFields && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Scheidung</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Hochzeitsdatum"
              value={data.hochzeitsdatum}
              onChange={(value) => updateField('hochzeitsdatum', value)}
              type="date"
              icon={Calendar}
            />
            
            <InputField
              label="Hochzeitsort"
              value={data.hochzeitsort}
              onChange={(value) => updateField('hochzeitsort', value)}
              placeholder="Ort der Eheschließung"
            />
            
            <InputField
              label="Standesamt Eheschließung"
              value={data.eheStandesamt}
              onChange={(value) => updateField('eheStandesamt', value)}
              placeholder="Automatisch aus Hochzeitsort"
            />
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Eheregisternummer
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">E</span>
                <input
                  type="text"
                  value={data.eheregisternummer?.replace(/^E/, '').replace(/\/\d{4}$/, '') || ''}
                  onChange={(e) => {
                    const year = data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : new Date().getFullYear()
                    updateField('eheregisternummer', `E${e.target.value}/${year}`)
                  }}
                  placeholder="123"
                  maxLength={4}
                  className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
                />
                <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                  /{data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : 'JJJJ'}
                </span>
              </div>
            </div>
            
            <InputField
              label="Scheidungsdatum"
              value={data.scheidungsdatum}
              onChange={(value) => updateField('scheidungsdatum', value)}
              type="date"
              icon={Calendar}
            />
            
            <InputField
              label="Amtsgericht"
              value={data.amtsgericht}
              onChange={(value) => updateField('amtsgericht', value)}
              placeholder="Zuständiges Amtsgericht"
            />
            
            <InputField
              label="Aktenzeichen Scheidung"
              value={data.scheidungsAktenzeichen}
              onChange={(value) => updateField('scheidungsAktenzeichen', value)}
              placeholder="Aktenzeichen der Scheidung"
            />
          </div>
        </div>
      )}

      {/* Tod des Ehepartners - nur bei verwitwet */}
      {showTodFields && (
        <>
          {/* Ehe-Daten */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Lebenspartnerschaft' : 'Ehe'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Partnerschaftsdatum' : 'Hochzeitsdatum'}
                value={data.hochzeitsdatum}
                onChange={(value) => updateField('hochzeitsdatum', value)}
                type="date"
                icon={Calendar}
              />
              
              <InputField
                label={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Ort der Partnerschaft' : 'Hochzeitsort'}
                value={data.hochzeitsort}
                onChange={(value) => updateField('hochzeitsort', value)}
                placeholder={verstorbenerData.familienstand === 'eingetragene Lebenspartnerschaft' ? 'Ort der Partnerschaft' : 'Ort der Eheschließung'}
              />
              
              <InputField
                label="Standesamt"
                value={data.eheStandesamt}
                onChange={(value) => updateField('eheStandesamt', value)}
                placeholder="Automatisch aus Ort"
              />
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {verstorbenerData.familienstand === 'Eingetragene Lebenspartnerschaft' ? 'Partnerschaftsregisternummer' : 'Eheregisternummer'}
                </label>
                <div className="flex items-center space-x-1">
                  <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">E</span>
                  <input
                    type="text"
                    value={data.eheregisternummer?.replace(/^E/, '').replace(/\/\d{4}$/, '') || ''}
                    onChange={(e) => {
                      const year = data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : new Date().getFullYear()
                      updateField('eheregisternummer', `E${e.target.value}/${year}`)
                    }}
                    placeholder="123"
                    maxLength={4}
                    className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
                  />
                  <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                    /{data.hochzeitsdatum ? new Date(data.hochzeitsdatum).getFullYear() : 'JJJJ'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Adresse */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-corda-gold" />
          <span>Adresse</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <AddressAutocompleteField
              label="Straße"
              value={data.strasse}
              onChange={(value, addressData) => {
                console.log('AddressAutocompleteField onChange called with:', { value, addressData })
                if (addressData?.addressParts) {
                  console.log('Setting all address fields:', addressData.addressParts)
                  // Alle Adressfelder in einem einzigen Update setzen
                  setData({ 
                    ...data, 
                    strasse: addressData.addressParts.strasse,
                    hausnummer: addressData.addressParts.hausnummer,
                    plz: addressData.addressParts.plz,
                    ort: addressData.addressParts.ort,
                    ortsteil: addressData.addressParts.ortsteil
                  })
                } else {
                  console.log('Only setting street field:', value)
                  updateField('strasse', value)
                }
              }}
              placeholder="Straße eingeben..."
            />
          </div>
          <InputField
            label="Hausnummer"
            value={data.hausnummer}
            onChange={(value) => updateField('hausnummer', value)}
            placeholder="Nr."
          />
          <InputField
            label="PLZ"
            value={data.plz}
            onChange={(value) => updateField('plz', value)}
            placeholder="12345"
          />
          <InputField
            label="Ort"
            value={data.ort}
            onChange={(value) => updateField('ort', value)}
            placeholder="Stadt/Gemeinde"
          />
          <InputField
            label="Ortsteil"
            value={data.ortsteil}
            onChange={(value) => updateField('ortsteil', value)}
            placeholder="Ortsteil"
          />
        </div>
      </div>

      {/* Geburt */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Geburt</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Geburtsdatum"
            value={data.geburtsdatum}
            onChange={(value) => updateField('geburtsdatum', value)}
            type="date"
            required
            icon={Calendar}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Alter</label>
            <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-300">
              {data.alter ? `${data.alter} Jahre` : 'Automatisch berechnet'}
            </div>
          </div>
          
          <InputField
            label="Geburtsort"
            value={data.geburtsort}
            onChange={(value) => updateField('geburtsort', value)}
            placeholder="Stadt"
          />
          
          <InputField
            label="Geburts-Standesamt"
            value={data.geburtsStandesamt}
            onChange={(value) => updateField('geburtsStandesamt', value)}
            placeholder="Automatisch aus Geburtsort"
          />
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Geburtenregisternummer
            </label>
            <div className="flex items-center space-x-1">
              <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">G</span>
              <input
                type="text"
                value={data.geburtenregisternummerPrefix?.replace(/^G/, '').replace(/\/\d{4}$/, '') || ''}
                onChange={(e) => {
                  const year = data.geburtsdatum ? new Date(data.geburtsdatum).getFullYear() : new Date().getFullYear()
                  updateField('geburtenregisternummerPrefix', `G${e.target.value}/${year}`)
                }}
                placeholder="123"
                maxLength={4}
                className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
              />
              <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                /{data.geburtsdatum ? new Date(data.geburtsdatum).getFullYear() : 'JJJJ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tod-Sektion separat - ganz unten bei verwitwet */}
      {showTodFields && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tod des {partnerBezeichnung}s</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Verstorben am"
              value={data.verstorbenAm}
              onChange={(value) => updateField('verstorbenAm', value)}
              type="datetime-local"
              icon={Calendar}
            />
            
            <InputField
              label="Todesart"
              value={data.todesart}
              onChange={(value) => updateField('todesart', value)}
              type="select"
              options={TODESARTEN}
            />
            
            <InputField
              label="Sterbeort"
              value={data.sterbeort}
              onChange={(value) => updateField('sterbeort', value)}
              type="select"
              options={STERBEORTE}
            />
            
            <InputField
              label="Standesamt Sterbefall"
              value={data.standesamt}
              onChange={(value) => updateField('standesamt', value)}
              placeholder="Standesamt des Sterbefalls"
            />
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sterberegisternummer
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-white bg-gray-700 px-2 py-3 rounded-l-xl border border-gray-600 text-sm">S</span>
                <input
                  type="text"
                  value={data.sterberegisternummerPrefix?.replace(/^S/, '').replace(/\/\d{4}$/, '') || ''}
                  onChange={(e) => {
                    const year = data.verstorbenAm ? new Date(data.verstorbenAm).getFullYear() : new Date().getFullYear()
                    updateField('sterberegisternummerPrefix', `S${e.target.value}/${year}`)
                  }}
                  placeholder="123"
                  maxLength={4}
                  className="w-16 bg-gray-800/50 border border-gray-600 px-2 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300 text-center"
                />
                <span className="text-white bg-gray-700 px-2 py-3 rounded-r-xl border border-gray-600 text-sm">
                  /{data.verstorbenAm ? new Date(data.verstorbenAm).getFullYear() : 'JJJJ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bemerkungen */}
      <InputField
        label="Bemerkungen"
        value={data.bemerkungen}
        onChange={(value) => updateField('bemerkungen', value)}
        type="textarea"
        placeholder="Besondere Wünsche oder Anmerkungen..."
      />

      {/* Aus Akte übernehmen Modal */}
      {/* Aus Akte übernehmen Modal */}
      <AktenModal
        isOpen={showAktenModal}
        onClose={() => setShowAktenModal(false)}
        onLoadAktenDaten={loadAktenDaten}
        defaultPersonType="ehepartner"
        title="Ehepartnerdaten aus Akte übernehmen"
      />
    </div>
  )
}

// Bestattung Tab
function BestattungTab({ 
  data, 
  setData, 
  verstorbenerData,
  auftragData,
  auftraggeberData // Neu hinzugefügt
}: { 
  data: BestattungData
  setData: (data: BestattungData) => void
  verstorbenerData: PersonData
  auftragData: AuftragData
  auftraggeberData: PersonData // Neu hinzugefügt
}) {
  const [showVorlagenModal, setShowVorlagenModal] = useState(false)
  const [showAktenModal, setShowAktenModal] = useState(false)
  const [showCreateVorlageModal, setShowCreateVorlageModal] = useState(false)
  const [vorlagenSuchterm, setVorlagenSuchterm] = useState('')
  const [aktenSuchterm, setAktenSuchterm] = useState('')
  const [neueVorlageName, setNeueVorlageName] = useState('')
  const [neueVorlageBeschreibung, setNeueVorlageBeschreibung] = useState('')
  const [vorlageFelderAuswahl, setVorlageFelderAuswahl] = useState({
    bestattungsart: true,
    krematorium: true,
    friedhofMeer: true,
    mitFeier: true,
    mitSargfeier: true,
    mitUrnenfeier: true,
    grabart: true,
    abteilung: false,
    reihe: false,
    bemerkungen: false
  })
  const [bestattungsvorlagen, setBestattungsvorlagen] = useState<BestattungsVorlageData[]>([
    {
      id: '1',
      name: 'Standard Erdbestattung',
      beschreibung: 'Klassische Erdbestattung mit Trauerfeier',
      bestattungsart: 'Erdbestattung',
      friedhofMeer: 'Hauptfriedhof',
      mitFeier: true,
      grabart: 'Wahlgrab',
      istSystemvorlage: true,
      erstelltVon: 'System',
      erstelltAm: '2024-01-01'
    },
    {
      id: '2', 
      name: 'Feuerbestattung mit Sarg- und Urnenfeier',
      beschreibung: 'Feuerbestattung mit beiden Trauerfeierarten',
      bestattungsart: 'Feuerbestattung',
      krematorium: 'Krematorium Musterstadt',
      friedhofMeer: 'Waldfriedhof',
      mitFeier: true,
      mitSargfeier: true,
      mitUrnenfeier: true,
      grabart: 'Urnengrab',
      istSystemvorlage: true,
      erstelltVon: 'System',
      erstelltAm: '2024-01-01'
    },
    {
      id: '3',
      name: 'Meine Erdbestattung',
      beschreibung: 'Persönliche Vorlage für Erdbestattung',
      bestattungsart: 'Erdbestattung',
      friedhofMeer: 'Stadtfriedhof',
      mitFeier: true,
      grabart: 'Reihengrab',
      istSystemvorlage: false,
      erstelltVon: 'Max Mustermann',
      erstelltAm: '2024-12-01'
    }
  ])
  const [aktenEintraege] = useState<AktenEintragData[]>([
    {
      id: '1',
      typ: 'verstorbener',
      name: 'Max Mustermann',
      verstorbenAm: '2024-01-15',
      bestattungsdaten: {
        bestattungsart: 'Erdbestattung',
        friedhofMeer: 'Hauptfriedhof Musterstadt',
        friedhofMeerAdresse: 'Friedhofstraße 1, 12345 Musterstadt',
        mitFeier: true,
        grabart: 'Wahlgrab',
        abteilung: 'A',
        reihe: '12',
        nummer: '5',
        vorbelegungVorhanden: true,
        vorbelegungName: 'Maria Mustermann',
        zuletztBeigesetzt: '2020-03-10'
      },
      verstorbenerDaten: {
        anrede: 'Herr',
        vornamen: 'Max',
        nachname: 'Mustermann',
        geburtsdatum: '1950-05-15',
        verstorbenAm: '2024-01-15',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verheiratet',
        konfession: 'evangelisch'
      },
      auftraggeberDaten: {
        anrede: 'Frau',
        vornamen: 'Maria',
        nachname: 'Mustermann',
        geburtsdatum: '1955-08-20',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        telefon: '0123 456789',
        email: 'maria.mustermann@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verwitwet',
        konfession: 'evangelisch',
        beziehung: 'Ehepartner/in'
      },
      ehepartnerDaten: {
        anrede: 'Frau',
        vornamen: 'Maria',
        nachname: 'Mustermann',
        geburtsdatum: '1955-08-20',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verwitwet',
        konfession: 'evangelisch'
      }
    },
    {
      id: '2',
      typ: 'verstorbener',
      name: 'Anna Schmidt',
      verstorbenAm: '2024-02-20',
      bestattungsdaten: {
        bestattungsart: 'Feuerbestattung',
        krematorium: 'Krematorium Hildesheim',
        friedhofMeer: 'Waldfriedhof Schmidt',
        mitFeier: true,
        mitUrnenfeier: true,
        grabart: 'Urnengrab'
      },
      verstorbenerDaten: {
        anrede: 'Frau',
        vornamen: 'Anna',
        nachname: 'Schmidt',
        geburtsdatum: '1940-12-03',
        verstorbenAm: '2024-02-20',
        strasse: 'Gartenweg',
        hausnummer: '45',
        plz: '31134',
        ort: 'Hildesheim',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'ledig',
        konfession: 'katholisch'
      },
      auftraggeberDaten: {
        anrede: 'Herr',
        vornamen: 'Peter',
        nachname: 'Schmidt',
        geburtsdatum: '1965-03-12',
        strasse: 'Neue Straße',
        hausnummer: '78',
        plz: '31134',
        ort: 'Hildesheim',
        telefon: '05121 987654',
        email: 'peter.schmidt@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verheiratet',
        konfession: 'katholisch',
        beziehung: 'Kind'
      }
    },
    {
      id: '3',
      typ: 'vorsorge',
      name: 'Klaus Weber',
      bestattungsdaten: {
        bestattungsart: 'Seebestattung',
        mitFeier: false,
        grabart: 'Seebestattung Nord- oder Ostsee'
      },
      verstorbenerDaten: {
        anrede: 'Herr',
        vornamen: 'Klaus',
        nachname: 'Weber',
        geburtsdatum: '1960-07-30',
        strasse: 'Seestraße',
        hausnummer: '12',
        plz: '31135',
        ort: 'Hildesheim',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'geschieden',
        konfession: 'konfessionslos'
      },
      auftraggeberDaten: {
        anrede: 'Herr',
        vornamen: 'Klaus',
        nachname: 'Weber',
        geburtsdatum: '1960-07-30',
        strasse: 'Seestraße',
        hausnummer: '12',
        plz: '31135',
        ort: 'Hildesheim',
        telefon: '05121 555666',
        email: 'klaus.weber@email.de',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'geschieden',
        konfession: 'konfessionslos',
        beziehung: 'Selbst'
      }
    }
  ])
  const loadVorlage = (vorlage: BestattungsVorlageData) => {
    const newData: BestattungData = {
      ...data,
      bestattungsart: vorlage.bestattungsart,
      krematorium: vorlage.krematorium,
      krematoriumAdresse: vorlage.krematoriumAdresse,
      friedhofMeer: vorlage.friedhofMeer,
      friedhofMeerAdresse: vorlage.friedhofMeerAdresse,
      mitFeier: vorlage.mitFeier,
      mitSargfeier: vorlage.mitSargfeier,
      mitUrnenfeier: vorlage.mitUrnenfeier,
      grabart: vorlage.grabart,
      abteilung: vorlage.abteilung,
      reihe: vorlage.reihe,
      bemerkungen: vorlage.bemerkungen
    }
    setData(newData)
    setShowVorlagenModal(false)
  }

  const loadAktenDaten = (aktenEintrag: AktenEintragData, personType: 'verstorbener' | 'auftraggeber' | 'ehepartner') => {
    const bestattungsdaten = aktenEintrag.bestattungsdaten
    const newData: BestattungData = {
      ...data,
      ...bestattungsdaten
    }
    
    // Automatisch Vorbelegung ausfüllen wenn vorhanden
    if (bestattungsdaten.vorbelegungVorhanden && bestattungsdaten.vorbelegungName) {
      newData.vorbelegungVorhanden = true
      newData.vorbelegungName = bestattungsdaten.vorbelegungName
      newData.zuletztBeigesetzt = bestattungsdaten.zuletztBeigesetzt
    }
    
    setData(newData)
    setShowAktenModal(false)
  }

  const createVorlage = () => {
    if (!neueVorlageName.trim()) return
    
    const neueVorlage: BestattungsVorlageData = {
      id: Date.now().toString(),
      name: neueVorlageName,
      beschreibung: neueVorlageBeschreibung,
      bestattungsart: vorlageFelderAuswahl.bestattungsart ? data.bestattungsart : '',
      krematorium: vorlageFelderAuswahl.krematorium ? data.krematorium : undefined,
      krematoriumAdresse: vorlageFelderAuswahl.krematorium ? data.krematoriumAdresse : undefined,
      friedhofMeer: vorlageFelderAuswahl.friedhofMeer ? data.friedhofMeer : undefined,
      friedhofMeerAdresse: vorlageFelderAuswahl.friedhofMeer ? data.friedhofMeerAdresse : undefined,
      mitFeier: vorlageFelderAuswahl.mitFeier ? data.mitFeier : false,
      mitSargfeier: vorlageFelderAuswahl.mitSargfeier ? data.mitSargfeier : undefined,
      mitUrnenfeier: vorlageFelderAuswahl.mitUrnenfeier ? data.mitUrnenfeier : undefined,
      grabart: vorlageFelderAuswahl.grabart ? data.grabart : undefined,
      abteilung: vorlageFelderAuswahl.abteilung ? data.abteilung : undefined,
      reihe: vorlageFelderAuswahl.reihe ? data.reihe : undefined,
      bemerkungen: vorlageFelderAuswahl.bemerkungen ? data.bemerkungen : undefined,
      istSystemvorlage: false,
      erstelltVon: 'Aktueller Benutzer', // TODO: Aus Auth Context holen
      erstelltAm: new Date().toISOString().split('T')[0]
    }
    
    setBestattungsvorlagen([...bestattungsvorlagen, neueVorlage])
    setNeueVorlageName('')
    setNeueVorlageBeschreibung('')
    setVorlageFelderAuswahl({
      bestattungsart: true,
      krematorium: true,
      friedhofMeer: true,
      mitFeier: true,
      mitSargfeier: true,
      mitUrnenfeier: true,
      grabart: true,
      abteilung: false,
      reihe: false,
      bemerkungen: false
    })
    setShowCreateVorlageModal(false)
  }

  const deleteVorlage = (vorlageId: string) => {
    const vorlage = bestattungsvorlagen.find(v => v.id === vorlageId)
    if (vorlage && !vorlage.istSystemvorlage) {
      setBestattungsvorlagen(bestattungsvorlagen.filter(v => v.id !== vorlageId))
    }
  }

  // Gefilterte Listen für Suche
  const gefilterteVorlagen = bestattungsvorlagen.filter(vorlage =>
    vorlage.name.toLowerCase().includes(vorlagenSuchterm.toLowerCase()) ||
    vorlage.beschreibung?.toLowerCase().includes(vorlagenSuchterm.toLowerCase()) ||
    vorlage.bestattungsart.toLowerCase().includes(vorlagenSuchterm.toLowerCase())
  )

  const gefilterteAkten = aktenEintraege.filter(eintrag =>
    eintrag.name.toLowerCase().includes(aktenSuchterm.toLowerCase()) ||
    eintrag.typ.toLowerCase().includes(aktenSuchterm.toLowerCase()) ||
    eintrag.bestattungsdaten.bestattungsart.toLowerCase().includes(aktenSuchterm.toLowerCase())
  )

  const updateField = (field: keyof BestattungData, value: any) => {
    const newData = { ...data, [field]: value }
    
    // Automatische Berechnung der Verlängerung
    if ((field === 'beisetzungsdatum' || field === 'zuletztBeigesetzt') && newData.beisetzungsdatum && newData.zuletztBeigesetzt) {
      const beisetzungsjahr = new Date(newData.beisetzungsdatum).getFullYear()
      const letzteBeisetzungsjahr = new Date(newData.zuletztBeigesetzt).getFullYear()
      const bestattungsart = auftragData.bestattungsart
      
      let ruhezeit = 20 // Standard für Erdbestattung
      if (bestattungsart === 'Feuerbestattung') ruhezeit = 15
      
      const verlaengerungsjahr = beisetzungsjahr + ruhezeit - (beisetzungsjahr - letzteBeisetzungsjahr)
      newData.verlaengerungBis = `${verlaengerungsjahr}-12-31`
    }
    
    // Bei Trauerfeier automatisch Trauerfeierdatum einen Tag vor Beisetzung setzen
    if (field === 'beisetzungsdatum' && value && newData.mitFeier && !newData.trauerfeierdatum) {
      const beisetzung = new Date(value)
      beisetzung.setDate(beisetzung.getDate() - 1)
      newData.trauerfeierdatum = beisetzung.toISOString().split('T')[0]
    }
    
    // Bei Nutzungsrecht auf Auftraggeber übertragen die Daten automatisch setzen
    if (field === 'nutzungsrechtAufAuftraggeber' && value && auftraggeberData) {
      newData.nutzungsrechtPersonVorname = auftraggeberData.vornamen
      newData.nutzungsrechtPersonNachname = auftraggeberData.nachname
      newData.nutzungsrechtPersonStrasse = auftraggeberData.strasse
      newData.nutzungsrechtPersonHausnummer = auftraggeberData.hausnummer
      newData.nutzungsrechtPersonPlz = auftraggeberData.plz
      newData.nutzungsrechtPersonOrt = auftraggeberData.ort
      newData.nutzungsrechtPersonGeburtsdatum = auftraggeberData.geburtsdatum
      newData.nutzungsrechtPersonBeziehung = auftraggeberData.beziehung
      newData.nutzungsrechtPersonTelefon = auftraggeberData.telefon
      newData.nutzungsrechtPerson = `${auftraggeberData.vornamen || ''} ${auftraggeberData.nachname || ''}`.trim()
    }
    
    setData(newData)
  }

  // Bestattungsart aus Auftrag übernehmen
  React.useEffect(() => {
    if (auftragData.bestattungsart && auftragData.bestattungsart !== data.bestattungsart) {
      updateField('bestattungsart', auftragData.bestattungsart)
    }
  }, [auftragData.bestattungsart])

  // Grabart-Optionen basierend auf Bestattungsart
  const getGrabartOptionen = () => {
    switch (auftragData.bestattungsart) {
      case 'Erdbestattung':
        return GRABARTEN_ERDBESTATTUNG
      case 'Feuerbestattung':
      case 'Reerdigung':
        return GRABARTEN_FEUERBESTATTUNG
      case 'Seebestattung':
        return GRABARTEN_SEEBESTATTUNG
      default:
        return []
    }
  }

  // Label für Friedhof/Meer basierend auf Bestattungsart
  const getFriedhofLabel = () => {
    if (auftragData.bestattungsart === 'Seebestattung') {
      return 'Meer/Gewässer'
    }
    return 'Friedhof'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Church className="w-8 h-8 text-corda-gold" />
          <div>
            <h2 className="text-2xl font-bold text-white">Bestattung</h2>
            <p className="text-gray-400">Bestattungsdetails und Grabstätte</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowVorlagenModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-corda-gold/20 hover:bg-corda-gold/30 text-corda-gold border border-corda-gold/30 rounded-lg transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Aus Vorlage auswählen</span>
          </button>
          
          <button
            onClick={() => setShowAktenModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200"
          >
            <Copy className="w-4 h-4" />
            <span>Aus Akte übernehmen</span>
          </button>
        </div>
      </div>

      {/* Bestattungsart (aus Auftrag übernommen) */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Art der Bestattung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Bestattungsart</label>
            <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-300">
              {auftragData.bestattungsart || 'Noch nicht ausgewählt'}
              <span className="text-xs text-gray-400 ml-2">(aus Auftrag übernommen)</span>
            </div>
          </div>
          
          {(auftragData.bestattungsart === 'Feuerbestattung' || auftragData.bestattungsart === 'Seebestattung') && (
            <KrematoriumAutocompleteField
              label="Krematorium"
              value={data.krematorium}
              onChange={(value, addressData) => {
                updateField('krematorium', value)
                if (addressData) {
                  updateField('krematoriumAdresse', addressData.address)
                  updateField('krematoriumPlaceId', addressData.place_id)
                  updateField('krematoriumGeometry', addressData.geometry)
                }
              }}
              placeholder="Krematorium suchen..."
            />
          )}
          
          <FriedhofAutocompleteField
            label={getFriedhofLabel()}
            value={data.friedhofMeer}
            onChange={(value, addressData) => {
              updateField('friedhofMeer', value)
              if (addressData) {
                updateField('friedhofMeerAdresse', addressData.address)
                updateField('friedhofMeerPlaceId', addressData.place_id)
                updateField('friedhofMeerGeometry', addressData.geometry)
              }
            }}
            bestattungsart={auftragData.bestattungsart}
            placeholder={`${getFriedhofLabel()} suchen...`}
          />
          
          {/* Trauerfeier-Optionen bei Feuerbestattung/Seebestattung */}
          {(auftragData.bestattungsart === 'Feuerbestattung' || auftragData.bestattungsart === 'Seebestattung') && (
            <div className="col-span-full">
              <h4 className="text-white font-medium mb-3">Art der Trauerfeier</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={data.mitSargfeier || false}
                    onChange={(e) => updateField('mitSargfeier', e.target.checked)}
                    className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                  />
                  <span className="text-white">Mit Sargfeier</span>
                  <span className="text-gray-400 text-sm">(Trauerfeier am Sarg vor der Kremierung)</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={data.mitUrnenfeier || false}
                    onChange={(e) => updateField('mitUrnenfeier', e.target.checked)}
                    className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                  />
                  <span className="text-white">Mit Trauerfeier an der Urne</span>
                  <span className="text-gray-400 text-sm">(Trauerfeier mit der Urne nach der Kremierung)</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Standard Trauerfeier-Option für andere Bestattungsarten */}
          {auftragData.bestattungsart && auftragData.bestattungsart !== 'Feuerbestattung' && auftragData.bestattungsart !== 'Seebestattung' && (
            <div className="flex items-center space-x-3 pt-8">
              <input
                type="checkbox"
                checked={data.mitFeier}
                onChange={(e) => updateField('mitFeier', e.target.checked)}
                className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
              />
              <span className="text-white">Mit Trauerfeier</span>
            </div>
          )}
        </div>
      </div>

      {/* Termine */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Termine</h3>
        <div className="space-y-6">
          
          {/* Sargfeier-Termine */}
          {data.mitSargfeier && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="w-2 h-2 bg-corda-gold rounded-full mr-2"></span>
                Sargfeier (vor der Kremierung)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Datum der Sargfeier"
                  value={data.sargfeierDatum}
                  onChange={(value) => updateField('sargfeierDatum', value)}
                  type="date"
                  icon={Calendar}
                />
                
                <InputField
                  label="Uhrzeit der Sargfeier" 
                  value={data.sargfeierZeit}
                  onChange={(value) => updateField('sargfeierZeit', value)}
                  type="time"
                  icon={Clock}
                />
                
                <InputField
                  label="Ort der Sargfeier"
                  value={data.sargfeierOrt}
                  onChange={(value) => updateField('sargfeierOrt', value)}
                  placeholder="z.B. Friedhofskapelle, Krematorium"
                />
              </div>
            </div>
          )}
          
          {/* Urnenfeier-Termine */}
          {data.mitUrnenfeier && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="w-2 h-2 bg-corda-gold rounded-full mr-2"></span>
                Trauerfeier an der Urne (nach der Kremierung)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Datum der Urnenfeier"
                  value={data.urnenfeierDatum}
                  onChange={(value) => updateField('urnenfeierDatum', value)}
                  type="date"
                  icon={Calendar}
                />
                
                <InputField
                  label="Uhrzeit der Urnenfeier"
                  value={data.urnenfeierZeit}
                  onChange={(value) => updateField('urnenfeierZeit', value)}
                  type="time"
                  icon={Clock}
                />
                
                <InputField
                  label="Ort der Urnenfeier"
                  value={data.urnenfeierOrt}
                  onChange={(value) => updateField('urnenfeierOrt', value)}
                  placeholder="z.B. Friedhofskapelle, Kirche"
                />
              </div>
            </div>
          )}
          
          {/* Standard Trauerfeier für andere Bestattungsarten */}
          {(() => {
            // Bei anderen Bestattungsarten die normale mitFeier Option prüfen
            if (auftragData.bestattungsart && auftragData.bestattungsart !== 'Feuerbestattung' && auftragData.bestattungsart !== 'Seebestattung') {
              return data.mitFeier;
            }
            return false;
          })() && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="w-2 h-2 bg-corda-gold rounded-full mr-2"></span>
                Trauerfeier
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Trauerfeierdatum"
                  value={data.trauerfeierdatum}
                  onChange={(value) => updateField('trauerfeierdatum', value)}
                  type="date"
                  icon={Calendar}
                />
                
                <InputField
                  label="Uhrzeit der Trauerfeier"
                  value={data.trauerfeierZeit}
                  onChange={(value) => updateField('trauerfeierZeit', value)}
                  type="time"
                  icon={Clock}
                />
                
                <InputField
                  label="Ort der Trauerfeier"
                  value={data.trauerfeierort}
                  onChange={(value) => updateField('trauerfeierort', value)}
                  placeholder="z.B. Friedhofskapelle, Kirche"
                />
              </div>
            </div>
          )}
          
          {/* Beisetzungstermin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Beisetzungsdatum"
              value={data.beisetzungsdatum}
              onChange={(value) => updateField('beisetzungsdatum', value)}
              type="date"
              icon={Calendar}
              required
            />
          </div>
        </div>
      </div>

      {/* Grabstätte */}
      {auftragData.bestattungsart && auftragData.bestattungsart !== 'Seebestattung' && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Grabstätte</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
              label="Grabart"
              value={data.grabart}
              onChange={(value) => updateField('grabart', value)}
              type="select"
              options={getGrabartOptionen()}
            />
            
            <InputField
              label="Abteilung"
              value={data.abteilung}
              onChange={(value) => updateField('abteilung', value)}
              placeholder="z.B. A, B, C"
            />
            
            <InputField
              label="Reihe"
              value={data.reihe}
              onChange={(value) => updateField('reihe', value)}
              placeholder="Reihen-Nr."
            />
            
            <InputField
              label="Nummer"
              value={data.nummer}
              onChange={(value) => updateField('nummer', value)}
              placeholder="Grab-Nr."
            />
          </div>
        </div>
      )}

      {/* Vorbelegung */}
      {auftragData.bestattungsart && auftragData.bestattungsart !== 'Seebestattung' && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vorbelegung</h3>
          
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              checked={data.vorbelegungVorhanden || false}
              onChange={(e) => updateField('vorbelegungVorhanden', e.target.checked)}
              className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
            />
            <span className="text-white">Vorbelegung vorhanden (bereits belegte Grabstätte)</span>
          </div>
          
          {data.vorbelegungVorhanden && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Name der bereits beigesetzten Person"
                value={data.vorbelegungName}
                onChange={(value) => updateField('vorbelegungName', value)}
                placeholder="Vor- und Nachname"
              />
              
              <InputField
                label="Zuletzt beigesetzt am"
                value={data.zuletztBeigesetzt}
                onChange={(value) => updateField('zuletztBeigesetzt', value)}
                type="date"
                icon={Calendar}
              />
              
              <InputField
                label="Verlängerung bis"
                value={data.verlaengerungBis}
                onChange={(value) => updateField('verlaengerungBis', value)}
                type="date"
                icon={Calendar}
                placeholder="Wird automatisch berechnet"
              />
            </div>
          )}
        </div>
      )}

      {/* Nutzungsrecht */}
      {auftragData.bestattungsart && auftragData.bestattungsart !== 'Seebestattung' && (
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nutzungsrecht</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.nutzungsrechtUebertragen || false}
                onChange={(e) => updateField('nutzungsrechtUebertragen', e.target.checked)}
                className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
              />
              <span className="text-white">Nutzungsrecht übertragen</span>
            </div>
            
            {data.nutzungsrechtUebertragen && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={data.nutzungsrechtAufAuftraggeber || false}
                    onChange={(e) => {
                      updateField('nutzungsrechtAufAuftraggeber', e.target.checked)
                      if (e.target.checked) {
                        // Daten vom Auftraggeber übernehmen
                        updateField('nutzungsrechtPerson', `${data.nutzungsrechtPersonVorname || ''} ${data.nutzungsrechtPersonNachname || ''}`.trim())
                      }
                    }}
                    className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                  />
                  <span className="text-white">Auf Auftraggeber übertragen</span>
                </div>
                
                {!data.nutzungsrechtAufAuftraggeber && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="text-white font-medium col-span-full mb-2">Andere Person:</h4>
                    
                    <InputField
                      label="Vorname"
                      value={data.nutzungsrechtPersonVorname}
                      onChange={(value) => updateField('nutzungsrechtPersonVorname', value)}
                      placeholder="Vorname"
                    />
                    
                    <InputField
                      label="Nachname"
                      value={data.nutzungsrechtPersonNachname}
                      onChange={(value) => updateField('nutzungsrechtPersonNachname', value)}
                      placeholder="Nachname"
                    />
                    
                    <InputField
                      label="Geburtsdatum"
                      value={data.nutzungsrechtPersonGeburtsdatum}
                      onChange={(value) => updateField('nutzungsrechtPersonGeburtsdatum', value)}
                      type="date"
                      icon={Calendar}
                    />
                    
                    <InputField
                      label="Beziehung zum Verstorbenen"
                      value={data.nutzungsrechtPersonBeziehung}
                      onChange={(value) => updateField('nutzungsrechtPersonBeziehung', value)}
                      type="select"
                      options={BEZIEHUNGEN}
                    />
                    
                    <div className="col-span-full">
                      <h5 className="text-white font-medium mb-3">Adresse</h5>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InputField
                          label="Straße"
                          value={data.nutzungsrechtPersonStrasse}
                          onChange={(value) => updateField('nutzungsrechtPersonStrasse', value)}
                          placeholder="Straße"
                          className="md:col-span-2"
                        />
                        
                        <InputField
                          label="Hausnummer"
                          value={data.nutzungsrechtPersonHausnummer}
                          onChange={(value) => updateField('nutzungsrechtPersonHausnummer', value)}
                          placeholder="Nr."
                        />
                        
                        <InputField
                          label="PLZ"
                          value={data.nutzungsrechtPersonPlz}
                          onChange={(value) => updateField('nutzungsrechtPersonPlz', value)}
                          placeholder="PLZ"
                        />
                        
                        <InputField
                          label="Ort"
                          value={data.nutzungsrechtPersonOrt}
                          onChange={(value) => updateField('nutzungsrechtPersonOrt', value)}
                          placeholder="Ort"
                          className="md:col-span-3"
                        />
                      </div>
                    </div>
                    
                    <InputField
                      label="Telefonnummer"
                      value={data.nutzungsrechtPersonTelefon}
                      onChange={(value) => updateField('nutzungsrechtPersonTelefon', value)}
                      type="tel"
                      placeholder="Telefonnummer"
                      icon={Phone}
                      className="col-span-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bemerkungen */}
      <InputField
        label="Bemerkungen"
        value={data.bemerkungen}
        onChange={(value) => updateField('bemerkungen', value)}
        type="textarea"
        placeholder="Besondere Wünsche oder Anmerkungen..."
      />

      {/* Vorlagen Modal */}
      {showVorlagenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Bestattungsvorlage auswählen</h3>
              <button
                onClick={() => setShowVorlagenModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Suchfeld und Neue Vorlage Button */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Vorlagen durchsuchen..."
                  value={vorlagenSuchterm}
                  onChange={(e) => setVorlagenSuchterm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corda-gold focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowCreateVorlageModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Neue Vorlage</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {gefilterteVorlagen.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Vorlagen gefunden</p>
                </div>
              ) : (
                gefilterteVorlagen.map((vorlage) => (
                  <div
                    key={vorlage.id}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => loadVorlage(vorlage)}
                      >
                        <h4 className="text-white font-medium">{vorlage.name}</h4>
                        {vorlage.beschreibung && (
                          <p className="text-gray-400 text-sm mt-1">{vorlage.beschreibung}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                          <span>Bestattungsart: {vorlage.bestattungsart}</span>
                          {vorlage.friedhofMeer && <span>Friedhof: {vorlage.friedhofMeer}</span>}
                          {vorlage.grabart && <span>Grabart: {vorlage.grabart}</span>}
                        </div>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                          <span>Erstellt von: {vorlage.erstelltVon}</span>
                          <span>•</span>
                          <span>{new Date(vorlage.erstelltAm || '').toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {vorlage.istSystemvorlage && (
                          <span className="px-2 py-1 bg-corda-gold/20 text-corda-gold text-xs rounded">
                            System
                          </span>
                        )}
                        {!vorlage.istSystemvorlage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteVorlage(vorlage.id)
                            }}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                            title="Vorlage löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => loadVorlage(vorlage)}
                          className="p-1 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded transition-colors"
                          title="Vorlage verwenden"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Akten Modal */}
      {showAktenModal && (
        <AktenModal
          isOpen={showAktenModal}
          onClose={() => setShowAktenModal(false)}
          onLoadAktenDaten={loadAktenDaten}
          defaultPersonType="verstorbener"
          title="Bestattungsdaten aus Akte übernehmen"
        />
      )}

      {/* Neue Vorlage erstellen Modal */}
      {showCreateVorlageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Neue Bestattungsvorlage erstellen</h3>
              <button
                onClick={() => {
                  setShowCreateVorlageModal(false)
                  setNeueVorlageName('')
                  setNeueVorlageBeschreibung('')
                  setVorlageFelderAuswahl({
                    bestattungsart: true,
                    krematorium: true,
                    friedhofMeer: true,
                    mitFeier: true,
                    mitSargfeier: true,
                    mitUrnenfeier: true,
                    grabart: true,
                    abteilung: false,
                    reihe: false,
                    bemerkungen: false
                  })
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vorlagenname *
                  </label>
                  <input
                    type="text"
                    value={neueVorlageName}
                    onChange={(e) => setNeueVorlageName(e.target.value)}
                    placeholder="z.B. Meine Standard Erdbestattung"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corda-gold focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Beschreibung (optional)
                  </label>
                  <input
                    type="text"
                    value={neueVorlageBeschreibung}
                    onChange={(e) => setNeueVorlageBeschreibung(e.target.value)}
                    placeholder="Kurze Beschreibung der Vorlage..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corda-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Felder auswählen, die in die Vorlage übernommen werden sollen:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.bestattungsart}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, bestattungsart: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Bestattungsart</span>
                    {data.bestattungsart && (
                      <span className="text-xs text-gray-400">({data.bestattungsart})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.krematorium}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, krematorium: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Krematorium</span>
                    {data.krematorium && (
                      <span className="text-xs text-gray-400 truncate">({data.krematorium})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.friedhofMeer}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, friedhofMeer: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Friedhof/Meer</span>
                    {data.friedhofMeer && (
                      <span className="text-xs text-gray-400 truncate">({data.friedhofMeer})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.mitFeier}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, mitFeier: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Mit Trauerfeier</span>
                    <span className="text-xs text-gray-400">({data.mitFeier ? 'Ja' : 'Nein'})</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.mitSargfeier}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, mitSargfeier: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Mit Sargfeier</span>
                    {data.mitSargfeier && (
                      <span className="text-xs text-gray-400">(Ja)</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.mitUrnenfeier}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, mitUrnenfeier: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Mit Urnenfeier</span>
                    {data.mitUrnenfeier && (
                      <span className="text-xs text-gray-400">(Ja)</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.grabart}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, grabart: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Grabart</span>
                    {data.grabart && (
                      <span className="text-xs text-gray-400">({data.grabart})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.abteilung}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, abteilung: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Abteilung</span>
                    {data.abteilung && (
                      <span className="text-xs text-gray-400">({data.abteilung})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.reihe}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, reihe: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Reihe</span>
                    {data.reihe && (
                      <span className="text-xs text-gray-400">({data.reihe})</span>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={vorlageFelderAuswahl.bemerkungen}
                      onChange={(e) => setVorlageFelderAuswahl({...vorlageFelderAuswahl, bemerkungen: e.target.checked})}
                      className="w-4 h-4 text-corda-gold bg-gray-700 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Bemerkungen</span>
                    {data.bemerkungen && (
                      <span className="text-xs text-gray-400">(vorhanden)</span>
                    )}
                  </label>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setVorlageFelderAuswahl({
                        bestattungsart: true,
                        krematorium: true,
                        friedhofMeer: true,
                        mitFeier: true,
                        mitSargfeier: true,
                        mitUrnenfeier: true,
                        grabart: true,
                        abteilung: true,
                        reihe: true,
                        bemerkungen: true
                      })}
                      className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      Alle auswählen
                    </button>
                    <button
                      onClick={() => setVorlageFelderAuswahl({
                        bestattungsart: false,
                        krematorium: false,
                        friedhofMeer: false,
                        mitFeier: false,
                        mitSargfeier: false,
                        mitUrnenfeier: false,
                        grabart: false,
                        abteilung: false,
                        reihe: false,
                        bemerkungen: false
                      })}
                      className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      Alle abwählen
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Object.values(vorlageFelderAuswahl).filter(Boolean).length} von {Object.keys(vorlageFelderAuswahl).length} Feldern ausgewählt
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateVorlageModal(false)
                  setNeueVorlageName('')
                  setNeueVorlageBeschreibung('')
                  setVorlageFelderAuswahl({
                    bestattungsart: true,
                    krematorium: true,
                    friedhofMeer: true,
                    mitFeier: true,
                    mitSargfeier: true,
                    mitUrnenfeier: true,
                    grabart: true,
                    abteilung: false,
                    reihe: false,
                    bemerkungen: false
                  })
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={createVorlage}
                disabled={!neueVorlageName.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Vorlage erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Posten Tab
function PostenTab({ 
  data, 
  setData, 
  bestattungsart, 
  onLoadTemplate 
}: { 
  data: PostenData[]
  setData: (data: PostenData[]) => void
  bestattungsart: string
  onLoadTemplate: (bestattungsart: string) => void
}) {
  const [showPostenVorlagen, setShowPostenVorlagen] = useState(false)
  const [showListenManager, setShowListenManager] = useState(false)
  const [showPostenAktenModal, setShowPostenAktenModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKategorie, setSelectedKategorie] = useState('')
  const [selectedTyp, setSelectedTyp] = useState('alle')
  const [showBruttoPreise, setShowBruttoPreise] = useState(true) // Neuer State für Brutto/Netto Anzeige

  // Hilfsfunktion für Steuerberechnung
  const calculateTaxValues = (preis: number, steuersatz: number, istBrutto: boolean) => {
    if (steuersatz === 0) {
      return {
        nettopreis: preis,
        bruttopreis: preis,
        steuerBetrag: 0
      }
    }

    if (istBrutto) {
      const nettopreis = preis / (1 + steuersatz / 100)
      const steuerBetrag = preis - nettopreis
      return {
        nettopreis: Number(nettopreis.toFixed(2)),
        bruttopreis: preis,
        steuerBetrag: Number(steuerBetrag.toFixed(2))
      }
    } else {
      const bruttopreis = preis * (1 + steuersatz / 100)
      const steuerBetrag = bruttopreis - preis
      return {
        nettopreis: preis,
        bruttopreis: Number(bruttopreis.toFixed(2)),
        steuerBetrag: Number(steuerBetrag.toFixed(2))
      }
    }
  }

  // Drag & Drop Sensoren
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex(item => item.id === active.id)
      const newIndex = data.findIndex(item => item.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setData(arrayMove(data, oldIndex, newIndex))
      }
    }
  }

  const dragEndEffects = {
    duration: 350,
    easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Benutzer-Berechtigung (TODO: Aus Authentication Context holen)
  const [userPermissions, setUserPermissions] = useState({
    istGeschaeftsfuehrung: false, // Wird später aus Context geladen
    kannPostenErstellen: false
  })

  // Eigene Listen State
  const [eigeneListen, setEigeneListen] = useState<PostenListeData[]>([])

  // Beispiel-Listen (Systemlisten)
  const systemListen: PostenListeData[] = [
    {
      id: 'erdbestattung-standard',
      name: 'Erdbestattung Standard',
      beschreibung: 'Standardposten für Erdbestattung',
      istSystemliste: true,
      posten: [
        { id: '1', typ: 'eigen', bezeichnung: 'Holzsarg Eiche', einzelpreis: 850.00, anzahl: 1, gesamtpreis: 850.00, kategorie: 'Sarg', isVorlage: false, isCustom: false },
        { id: '2', typ: 'eigen', bezeichnung: 'Grabstelle Erdbestattung', einzelpreis: 450.00, anzahl: 1, gesamtpreis: 450.00, kategorie: 'Friedhof', isVorlage: false, isCustom: false },
        { id: '3', typ: 'eigen', bezeichnung: 'Überführung', einzelpreis: 120.00, anzahl: 1, gesamtpreis: 120.00, kategorie: 'Transport', isVorlage: false, isCustom: false },
        { id: '4', typ: 'fremd', bezeichnung: 'Friedhofsgebühren', einzelpreis: 380.00, anzahl: 1, gesamtpreis: 380.00, kategorie: 'Gebühren', isVorlage: false, isCustom: false }
      ]
    },
    {
      id: 'feuerbestattung-standard', 
      name: 'Feuerbestattung Standard',
      beschreibung: 'Standardposten für Feuerbestattung',
      istSystemliste: true,
      posten: [
        { id: '1', typ: 'eigen', bezeichnung: 'Verbrennungssarg', einzelpreis: 280.00, anzahl: 1, gesamtpreis: 280.00, kategorie: 'Sarg', isVorlage: false, isCustom: false },
        { id: '2', typ: 'fremd', bezeichnung: 'Krematoriumsgebühren', einzelpreis: 320.00, anzahl: 1, gesamtpreis: 320.00, kategorie: 'Krematorium', isVorlage: false, isCustom: false },
        { id: '3', typ: 'eigen', bezeichnung: 'Urne Standard', einzelpreis: 65.00, anzahl: 1, gesamtpreis: 65.00, kategorie: 'Urne', isVorlage: false, isCustom: false },
        { id: '4', typ: 'eigen', bezeichnung: 'Überführung', einzelpreis: 120.00, anzahl: 1, gesamtpreis: 120.00, kategorie: 'Transport', isVorlage: false, isCustom: false }
      ]
    }
  ]

  // Erweiterte Posten-Datenbank mit verschiedenen Kategorien
  const standardVorlagen: PostenVorlageData[] = [
    // === HANDELSWARE ===
    { id: '90', typ: 'handelsware', bezeichnung: 'Trauerkarte Klassik', kategorie: 'Dekoration', einzelpreis: 2.50, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Einfache Trauerkarte' },
    { id: '91', typ: 'handelsware', bezeichnung: 'Trauerkarte Premium', kategorie: 'Dekoration', einzelpreis: 4.80, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Hochwertige Trauerkarte mit Veredelung' },
    { id: '92', typ: 'handelsware', bezeichnung: 'Kondolenzbuch', kategorie: 'Dekoration', einzelpreis: 18.50, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '93', typ: 'handelsware', bezeichnung: 'Trauerkerze', kategorie: 'Dekoration', einzelpreis: 12.90, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '94', typ: 'handelsware', bezeichnung: 'Sargkissen', kategorie: 'Sarg', einzelpreis: 35.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '95', typ: 'handelsware', bezeichnung: 'Sargdecke', kategorie: 'Sarg', einzelpreis: 45.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '96', typ: 'handelsware', bezeichnung: 'Urnenband', kategorie: 'Urne', einzelpreis: 8.50, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '97', typ: 'handelsware', bezeichnung: 'Trauerband', kategorie: 'Dekoration', einzelpreis: 15.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },

    // === SÄRGE & URNEN ===
    { id: '1', typ: 'eigen', bezeichnung: 'Eichensarg Standard', kategorie: 'Sarg', einzelpreis: 850.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Massivholzsarg Eiche, naturbelassen' },
    { id: '2', typ: 'eigen', bezeichnung: 'Eichensarg Premium', kategorie: 'Sarg', einzelpreis: 1200.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Hochwertiger Eichensarg mit Beschlägen' },
    { id: '3', typ: 'eigen', bezeichnung: 'Fichtensarg Budget', kategorie: 'Sarg', einzelpreis: 480.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Einfacher Fichtensarg für Erdbestattung' },
    { id: '4', typ: 'eigen', bezeichnung: 'Verbrennungssarg', kategorie: 'Sarg', einzelpreis: 280.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Spezieller Sarg für Kremation' },
    { id: '5', typ: 'eigen', bezeichnung: 'Urne Standard Messing', kategorie: 'Urne', einzelpreis: 89.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '6', typ: 'eigen', bezeichnung: 'Urne Premium Marmor', kategorie: 'Urne', einzelpreis: 280.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '7', typ: 'eigen', bezeichnung: 'Urne Holz Eiche', kategorie: 'Urne', einzelpreis: 150.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '8', typ: 'eigen', bezeichnung: 'Keramikurne handgefertigt', kategorie: 'Urne', einzelpreis: 320.00, istBasisPosten: false, nurGeschaeftsfuehrung: false },

    // === TRANSPORT & LOGISTIK ===
    { id: '10', typ: 'eigen', bezeichnung: 'Überführung lokal', kategorie: 'Transport', einzelpreis: 120.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Überführung innerhalb 50km' },
    { id: '11', typ: 'eigen', bezeichnung: 'Überführung Fernstrecke', kategorie: 'Transport', einzelpreis: 2.50, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Pro Kilometer über 50km' },
    { id: '12', typ: 'eigen', bezeichnung: 'Auslandsüberführung', kategorie: 'Transport', einzelpreis: 2800.00, istBasisPosten: false, nurGeschaeftsfuehrung: true, beschreibung: 'Überführung ins Ausland mit Formalitäten' },
    { id: '13', typ: 'eigen', bezeichnung: 'Bergung/Sondertransport', kategorie: 'Transport', einzelpreis: 450.00, istBasisPosten: false, nurGeschaeftsfuehrung: true },

    // === DIENSTLEISTUNGEN ===
    { id: '20', typ: 'eigen', bezeichnung: 'Hygienische Versorgung', kategorie: 'Dienstleistung', einzelpreis: 180.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Waschen und ankleiden' },
    { id: '21', typ: 'eigen', bezeichnung: 'Einbalsamierung', kategorie: 'Dienstleistung', einzelpreis: 580.00, istBasisPosten: false, nurGeschaeftsfuehrung: false, beschreibung: 'Konservierung für Aufbahrung' },
    { id: '22', typ: 'eigen', bezeichnung: 'Aufbahrung (1 Tag)', kategorie: 'Dienstleistung', einzelpreis: 120.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '23', typ: 'eigen', bezeichnung: 'Trauerfeier Organisation', kategorie: 'Dienstleistung', einzelpreis: 250.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '24', typ: 'eigen', bezeichnung: 'Trauerredner', kategorie: 'Dienstleistung', einzelpreis: 350.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '25', typ: 'eigen', bezeichnung: 'Leichenschmaus Organisation', kategorie: 'Dienstleistung', einzelpreis: 80.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Ohne Kosten für Speisen' },

    // === GRABBELEGUNG ===
    { id: '30', typ: 'eigen', bezeichnung: 'Wahlgrab Einzelstelle', kategorie: 'Grabbelegung', einzelpreis: 1200.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: '25 Jahre Nutzungsrecht' },
    { id: '31', typ: 'eigen', bezeichnung: 'Wahlgrab Doppelstelle', kategorie: 'Grabbelegung', einzelpreis: 1800.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: '25 Jahre Nutzungsrecht' },
    { id: '32', typ: 'eigen', bezeichnung: 'Reihengrab', kategorie: 'Grabbelegung', einzelpreis: 650.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: '20 Jahre Nutzungsrecht' },
    { id: '33', typ: 'eigen', bezeichnung: 'Urnengrab', kategorie: 'Grabbelegung', einzelpreis: 480.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '34', typ: 'eigen', bezeichnung: 'Seebestattung', kategorie: 'Grabbelegung', einzelpreis: 850.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },

    // === DEKORATION & BLUMEN ===
    { id: '40', typ: 'eigen', bezeichnung: 'Sargbukett', kategorie: 'Dekoration', einzelpreis: 85.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '41', typ: 'eigen', bezeichnung: 'Trauerkranz', kategorie: 'Dekoration', einzelpreis: 120.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '42', typ: 'eigen', bezeichnung: 'Trauergesteck', kategorie: 'Dekoration', einzelpreis: 75.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '43', typ: 'eigen', bezeichnung: 'Kerzen & Beleuchtung', kategorie: 'Dekoration', einzelpreis: 45.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },

    // === FREMDLEISTUNGEN ===
    { id: '50', typ: 'fremd', bezeichnung: 'Krematoriumsgebühren', kategorie: 'Krematorium', einzelpreis: 320.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '51', typ: 'fremd', bezeichnung: 'Friedhofsgebühren', kategorie: 'Gebühren', einzelpreis: 380.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '52', typ: 'fremd', bezeichnung: 'Standesamtgebühren', kategorie: 'Gebühren', einzelpreis: 15.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '53', typ: 'fremd', bezeichnung: 'Arztkosten Totenschein', kategorie: 'Gebühren', einzelpreis: 45.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '54', typ: 'fremd', bezeichnung: 'Zeitungsanzeige', kategorie: 'Gebühren', einzelpreis: 120.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },

    // === DURCHLAUFENDE POSTEN ===
    { id: '60', typ: 'durchlaufend', bezeichnung: 'Musik/Organist', kategorie: 'Trauerfeier', einzelpreis: 180.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '61', typ: 'durchlaufend', bezeichnung: 'Catering Leichenschmaus', kategorie: 'Trauerfeier', einzelpreis: 0.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Preis nach Vereinbarung' },
    { id: '62', typ: 'durchlaufend', bezeichnung: 'Steinmetz Grabstein', kategorie: 'Grabmal', einzelpreis: 0.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Preis nach Auswahl' },
    { id: '63', typ: 'durchlaufend', bezeichnung: 'Gärtner Grabpflege', kategorie: 'Grabpflege', einzelpreis: 0.00, istBasisPosten: true, nurGeschaeftsfuehrung: false, beschreibung: 'Preis nach Vereinbarung' },

    // === VERWALTUNG & FORMALITÄTEN ===
    { id: '70', typ: 'eigen', bezeichnung: 'Behördengänge', kategorie: 'Verwaltung', einzelpreis: 80.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '71', typ: 'eigen', bezeichnung: 'Rentenantrag', kategorie: 'Verwaltung', einzelpreis: 120.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },
    { id: '72', typ: 'eigen', bezeichnung: 'Versicherungsabwicklung', kategorie: 'Verwaltung', einzelpreis: 150.00, istBasisPosten: true, nurGeschaeftsfuehrung: false },

    // === SONDERLEISTUNGEN ===
    { id: '80', typ: 'eigen', bezeichnung: 'Nachtbereitschaft', kategorie: 'Sonderleistung', einzelpreis: 200.00, istBasisPosten: false, nurGeschaeftsfuehrung: false },
    { id: '81', typ: 'eigen', bezeichnung: 'Wochenendservice', kategorie: 'Sonderleistung', einzelpreis: 150.00, istBasisPosten: false, nurGeschaeftsfuehrung: false },
    { id: '82', typ: 'eigen', bezeichnung: 'Besondere Wünsche', kategorie: 'Sonderleistung', einzelpreis: 0.00, istBasisPosten: false, nurGeschaeftsfuehrung: true, beschreibung: 'Individuelle Vereinbarung' }
  ]

  const kategorien = [
    'Sarg', 'Urne', 'Transport', 'Dienstleistung', 'Grabbelegung', 
    'Dekoration', 'Krematorium', 'Gebühren', 'Trauerfeier', 'Grabmal', 
    'Grabpflege', 'Verwaltung', 'Sonderleistung', 'Sonstiges'
  ]

  const updatePosten = (id: string, field: keyof PostenData, value: any) => {
    setData(data.map(posten => 
      posten.id === id 
        ? { 
            ...posten, 
            [field]: value,
            gesamtpreis: field === 'einzelpreis' || field === 'anzahl' 
              ? (field === 'einzelpreis' ? value : posten.einzelpreis) * (field === 'anzahl' ? value : posten.anzahl)
              : posten.gesamtpreis
          }
        : posten
    ))
  }

  const addPosten = () => {
    const newPosten: PostenData = {
      id: `posten-${Date.now()}`,
      typ: 'handelsware',
      bezeichnung: '',
      einzelpreis: 0,
      anzahl: 1,
      gesamtpreis: 0,
      kategorie: 'Sonstiges',
      isVorlage: false,
      isCustom: true,
      steuersatz: 0,
      nettopreis: 0,
      bruttopreis: 0,
      steuerBetrag: 0,
      preisIstBrutto: true
    }
    setData([...data, newPosten])
  }

  const addPostenFromVorlage = (vorlage: PostenVorlageData) => {
    const newPosten: PostenData = {
      id: `posten-${Date.now()}`,
      typ: vorlage.typ,
      bezeichnung: vorlage.bezeichnung,
      einzelpreis: vorlage.einzelpreis,
      anzahl: 1,
      gesamtpreis: vorlage.einzelpreis,
      kategorie: vorlage.kategorie,
      beschreibung: vorlage.beschreibung,
      isVorlage: true,
      steuersatz: 0,
      nettopreis: 0,
      bruttopreis: 0,
      steuerBetrag: 0,
      preisIstBrutto: true
    }
    setData([...data, newPosten])
    setShowPostenVorlagen(false)
  }

  const loadListe = (liste: PostenListeData) => {
    const listePosten = liste.posten.map(p => ({
      ...p,
      id: `posten-${Date.now()}-${p.id}`,
      gesamtpreis: p.einzelpreis * p.anzahl
    }))
    setData([...data, ...listePosten])
    setShowListenManager(false)
  }

  const saveCurrentAsListe = () => {
    if (data.length === 0) return
    
    const listeName = prompt('Name für die neue Liste:')
    if (!listeName) return

    const neueListe: PostenListeData = {
      id: `liste-${Date.now()}`,
      name: listeName,
      beschreibung: `Erstellt aus aktuellem Sterbefall`,
      posten: data.map(p => ({ ...p, id: p.id })),
      istSystemliste: false,
      erstelltVon: 'Aktueller Nutzer', // TODO: Aus Context
      erstelltAm: new Date().toLocaleDateString('de-DE')
    }
    
    setEigeneListen([...eigeneListen, neueListe])
    alert('Liste wurde gespeichert!')
  }

  const removePosten = (id: string) => {
    setData(data.filter(posten => posten.id !== id))
  }

  // Funktion um Posten aus einer Akte zu laden
  const loadPostenFromAkte = (aktenEintrag: AktenEintragData) => {
    // Simuliere das Laden von Posten aus einer Akte
    // In einer echten Implementation würde das über eine API erfolgen
    const mockPostenData: PostenData[] = []
    
    // Erstelle Beispiel-Posten basierend auf dem Aktentyp und der Bestattungsart
    if (aktenEintrag.typ === 'verstorbener' || aktenEintrag.typ === 'vorsorge') {
      const bestattungsart = aktenEintrag.bestattungsdaten?.bestattungsart || ''
      
      if (bestattungsart === 'Erdbestattung') {
        mockPostenData.push(
          {
            id: `from-akte-${Date.now()}-1`,
            typ: 'eigen',
            bezeichnung: 'Überführung',
            einzelpreis: 150.00,
            anzahl: 1,
            gesamtpreis: 150.00,
            kategorie: 'Transport',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `from-akte-${Date.now()}-2`,
            typ: 'eigen',
            bezeichnung: 'Sarg Eiche',
            einzelpreis: 850.00,
            anzahl: 1,
            gesamtpreis: 850.00,
            kategorie: 'Sarg',
            isVorlage: false,
            isCustom: false
          }
        )
      } else if (bestattungsart === 'Feuerbestattung') {
        mockPostenData.push(
          {
            id: `from-akte-${Date.now()}-1`,
            typ: 'eigen',
            bezeichnung: 'Kremationssarg',
            einzelpreis: 450.00,
            anzahl: 1,
            gesamtpreis: 450.00,
            kategorie: 'Sarg',
            isVorlage: false,
            isCustom: false
          },
          {
            id: `from-akte-${Date.now()}-2`,
            typ: 'fremd',
            bezeichnung: 'Krematoriumsgebühren',
            einzelpreis: 320.00,
            anzahl: 1,
            gesamtpreis: 320.00,
            kategorie: 'Krematorium',
            isVorlage: false,
            isCustom: false
          }
        )
      }
    }
    
    // Füge die geladenen Posten zu den bestehenden hinzu
    setData([...data, ...mockPostenData])
    setShowPostenAktenModal(false)
  }

  const gesamtsumme = data.reduce((sum, posten) => sum + posten.gesamtpreis, 0)

  const filteredVorlagen = standardVorlagen.filter(vorlage => {
    if (!userPermissions.istGeschaeftsfuehrung && vorlage.nurGeschaeftsfuehrung) return false
    if (selectedKategorie && vorlage.kategorie !== selectedKategorie) return false
    if (selectedTyp !== 'alle' && vorlage.typ !== selectedTyp) return false
    if (searchTerm && !vorlage.bezeichnung.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const canCreateNewPosten = userPermissions.istGeschaeftsfuehrung || userPermissions.kannPostenErstellen

  return (
    <div className="space-y-8">
      {/* Header mit Buttons */}
      <div className="mb-6 relative">
        {/* Hauptüberschrift */}
        <div className="flex-shrink-0 max-w-[calc(100%-280px)]">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Package className="w-8 h-8 text-corda-gold" />
            <span>Postenübersicht</span>
          </h2>
          <p className="text-gray-400 mt-1">Verwaltung aller Bestattungsposten</p>
        </div>

        {/* Buttons Container - Absolute positioniert */}
        <div style={{ position: 'absolute', top: '2rem', right: '-16rem' }} className="flex flex-col gap-3 min-w-[240px] z-10">
          {/* Brutto/Netto Toggle */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
            <span className="text-sm text-gray-300">Preise:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBruttoPreise(!showBruttoPreise)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-corda-gold focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  showBruttoPreise ? 'bg-corda-gold' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showBruttoPreise ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium whitespace-nowrap ${showBruttoPreise ? 'text-corda-gold' : 'text-gray-400'}`}>
                {showBruttoPreise ? 'Brutto' : 'Netto'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowListenManager(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
          >
            <span>Listen verwalten</span>
            <List className="w-4 h-4 flex-shrink-0" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPostenAktenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
          >
            <span>Aus Akte übernehmen</span>
            <FolderOpen className="w-4 h-4 flex-shrink-0" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPostenVorlagen(true)}
            className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-300 shadow-lg shadow-corda-gold/25 hover:shadow-corda-gold/40"
          >
            <span>Posten hinzufügen</span>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </motion.button>
        </div>
      </div>

      {/* Posten Liste */}
      <div className="space-y-6">
        {data.length === 0 ? (
          <div className="bg-gray-800/30 rounded-xl p-8 text-center">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Noch keine Posten hinzugefügt</p>
            <p className="text-sm text-gray-500">Nutze die Buttons oben, um Posten hinzuzufügen</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            {/* Gruppierte Darstellung nach Typ */}
            {[
              { typ: 'handelsware', titel: 'Handelsware', farbe: 'from-yellow-600 to-yellow-700', icon: '📦', beschreibung: 'Verkaufte Waren und Artikel' },
              { typ: 'eigen', titel: 'Eigenleistungen', farbe: 'from-gray-600 to-gray-700', icon: '🔧', beschreibung: 'Eigene Dienstleistungen' },
              { typ: 'fremd', titel: 'Fremdleistungen', farbe: 'from-blue-600 to-blue-700', icon: '🏢', beschreibung: 'Externe Dienstleistungen' },
              { typ: 'durchlaufend', titel: 'Durchlaufende Posten', farbe: 'from-slate-600 to-slate-700', icon: '🔄', beschreibung: 'Weitergeleitete Posten' }
            ].map(gruppe => {
              const gruppenPosten = data.filter(posten => posten.typ === gruppe.typ)
              const gruppenSumme = gruppenPosten.reduce((sum, posten) => sum + posten.gesamtpreis, 0)
              
              if (gruppenPosten.length === 0) return null
              
              return (
                <div key={gruppe.typ} className="bg-gray-800/20 rounded-xl overflow-hidden">
                  {/* Gruppen-Header */}
                  <motion.div 
                    className={`bg-gradient-to-r ${gruppe.farbe} p-4`}
                    whileHover={{ 
                      scale: 1.005,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.2 }
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.span 
                          className="text-2xl"
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            repeatDelay: 8,
                            ease: "easeInOut"
                          }}
                        >
                          {gruppe.icon}
                        </motion.span>
                        <div>
                          <motion.h3 
                            className="text-xl font-bold text-white"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {gruppe.titel}
                          </motion.h3>
                          <motion.p 
                            className="text-gray-200 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            {gruppe.beschreibung}
                          </motion.p>
                        </div>
                      </div>
                      <motion.div 
                        className="text-right"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className="text-white font-bold text-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {gruppenSumme.toFixed(2)} €
                        </motion.div>
                        <motion.div 
                          className="text-gray-200 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          {gruppenPosten.length} Posten
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Tabellen-Header */}
                  <motion.div 
                    className="bg-gray-700/30 px-4 py-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300">
                      <div className="col-span-1"></div> {/* Drag Handle Spalte */}
                      <div className="col-span-3">Bezeichnung</div>
                      <div className="col-span-2">Kategorie</div>
                      <div className="col-span-2">Einzelpreis</div>
                      <div className="col-span-1">Anz.</div>
                      <div className="col-span-2">Gesamt</div>
                      <div className="col-span-1"></div>
                    </div>
                  </motion.div>
                  
                  {/* Posten der Gruppe mit staggered Animation */}
                  <motion.div 
                    className="p-4 space-y-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3
                        }
                      }
                    }}
                  >
                    <SortableContext 
                      items={gruppenPosten.map(p => p.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {gruppenPosten.map((posten, index) => (
                          <motion.div
                            key={posten.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ 
                              opacity: 0, 
                              x: -100,
                              scale: 0.95,
                              transition: { 
                                duration: 0.2,
                                ease: "easeInOut"
                              }
                            }}
                            transition={{
                              duration: 0.3,
                              ease: "easeOut"
                            }}
                          >
                            <SortablePostenItem
                              posten={posten}
                              updatePosten={updatePosten}
                              removePosten={removePosten}
                              kategorien={kategorien}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </SortableContext>
                  </motion.div>
                </div>
              )
            })}
          </DndContext>
        )}
      </div>

      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowPostenVorlagen(true)}
        className="w-full bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-6 text-gray-400 hover:text-white hover:border-corda-gold transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Neuen Posten hinzufügen</span>
      </motion.button>

      {/* Gesamtsumme mit Aufschlüsselung */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6">
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { typ: 'handelsware', titel: 'Handelsware', farbe: 'text-yellow-400', icon: '📦' },
              { typ: 'eigen', titel: 'Eigenleistungen', farbe: 'text-gray-300', icon: '🔧' },
              { typ: 'fremd', titel: 'Fremdleistungen', farbe: 'text-blue-400', icon: '🏢' },
              { typ: 'durchlaufend', titel: 'Durchlaufend', farbe: 'text-slate-400', icon: '🔄' }
            ].map(kategorie => {
              const kategoriePosten = data.filter(p => p.typ === kategorie.typ)
              const summe = kategoriePosten.reduce((sum, p) => sum + p.gesamtpreis, 0)
              
              return (
                <div key={kategorie.typ} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-lg mr-2">{kategorie.icon}</span>
                    <span className="text-sm font-medium text-gray-300">{kategorie.titel}</span>
                  </div>
                  <div className={`text-xl font-bold ${kategorie.farbe}`}>
                    {summe.toFixed(2)} €
                  </div>
                  <div className="text-xs text-gray-500">
                    {kategoriePosten.length} Posten
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <div className="border-t border-gray-600 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-white">Gesamtsumme:</span>
            <span className="text-2xl font-bold text-corda-gold">
              {gesamtsumme.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Listen Manager Modal */}
      {showListenManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Listen verwalten</h3>
              <div className="flex items-center space-x-3">
                {data.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      saveCurrentAsListe()
                      setShowListenManager(false)
                    }}
                    className="bg-corda-gold hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Aktuelle Liste speichern</span>
                  </motion.button>
                )}
                <button
                  onClick={() => setShowListenManager(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* System Listen */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Systemlisten</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemListen.map(liste => (
                    <div key={liste.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-white">{liste.name}</h5>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">System</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{liste.beschreibung}</p>
                      <p className="text-xs text-gray-500 mb-3">{liste.posten.length} Posten</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => loadListe(liste)}
                        className="w-full bg-corda-gold text-black font-semibold py-2 rounded-lg transition-colors"
                      >
                        Liste laden
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eigene Listen */}
              {eigeneListen.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Eigene Listen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eigeneListen.map(liste => (
                      <div key={liste.id} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-white">{liste.name}</h5>
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Eigene</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{liste.beschreibung}</p>
                        <p className="text-xs text-gray-500 mb-3">
                          {liste.posten.length} Posten • Erstellt: {liste.erstelltAm}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => loadListe(liste)}
                          className="w-full bg-corda-gold text-black font-semibold py-2 rounded-lg transition-colors"
                        >
                          Liste laden
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Posten Vorlagen Modal */}
      {showPostenVorlagen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Posten hinzufügen</h3>
              <button
                onClick={() => setShowPostenVorlagen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Suchfeld */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Posten durchsuchen..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold"
                />
              </div>
            </div>

            {/* Kategorie Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedKategorie('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedKategorie === '' 
                      ? 'bg-corda-gold text-black' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Alle ({standardVorlagen.length})
                </button>
                {kategorien.map(kategorie => {
                  const count = standardVorlagen.filter(v => v.kategorie === kategorie).length
                  if (count === 0) return null
                  
                  return (
                    <button
                      key={kategorie}
                      onClick={() => setSelectedKategorie(kategorie)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedKategorie === kategorie 
                          ? 'bg-corda-gold text-black' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {kategorie} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Typ Filter */}
            <div className="mb-6 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">Typ:</span>
              {['alle', 'handelsware', 'eigen', 'fremd', 'durchlaufend'].map(typ => (
                <label key={typ} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="typ-filter"
                    value={typ}
                    checked={selectedTyp === typ}
                    onChange={(e) => setSelectedTyp(e.target.value)}
                    className="text-corda-gold focus:ring-corda-gold"
                  />
                  <span className="text-sm text-gray-300 capitalize">{typ}</span>
                </label>
              ))}
            </div>

            {/* Posten Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVorlagen.map(vorlage => (
                <motion.div
                  key={vorlage.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 hover:border-corda-gold/50 transition-colors cursor-pointer"
                  onClick={() => addPostenFromVorlage(vorlage)}
                >
                  {/* Header mit Typ und Kategorie */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        vorlage.typ === 'handelsware' ? 'bg-yellow-600/20 text-yellow-300' :
                        vorlage.typ === 'eigen' ? 'bg-gray-600/20 text-gray-300' :
                        vorlage.typ === 'fremd' ? 'bg-blue-600/20 text-blue-300' :
                        'bg-slate-600/20 text-slate-300'
                      }`}>
                        {vorlage.typ.charAt(0).toUpperCase() + vorlage.typ.slice(1)}
                      </span>
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                        {vorlage.kategorie}
                      </span>
                    </div>
                    {vorlage.nurGeschaeftsfuehrung && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        GF
                      </span>
                    )}
                  </div>

                  {/* Titel */}
                  <h5 className="font-semibold text-white mb-2 line-clamp-2">{vorlage.bezeichnung}</h5>
                  
                  {/* Beschreibung */}
                  {vorlage.beschreibung && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{vorlage.beschreibung}</p>
                  )}
                  
                  {/* Preis */}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-corda-gold">
                      {vorlage.einzelpreis > 0 ? `${vorlage.einzelpreis.toFixed(2)} €` : 'Nach Vereinbarung'}
                    </p>
                    <div className="bg-corda-gold text-black px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Hinzufügen
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Keine Ergebnisse */}
            {filteredVorlagen.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Keine Posten gefunden</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm ? 'Versuche einen anderen Suchbegriff' : 'Wähle eine andere Kategorie'}
                </p>
              </div>
            )}

            {!canCreateNewPosten && (
              <div className="mt-6 p-4 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <p className="text-orange-200 text-sm">
                    Du kannst keine neuen Posten erstellen. Wende dich an die Geschäftsführung.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Akten Modal für Posten */}
      {showPostenAktenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Posten aus Akte übernehmen</h3>
              <button
                onClick={() => setShowPostenAktenModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <AktenModal
              isOpen={true}
              onClose={() => setShowPostenAktenModal(false)}
              onLoadAktenDaten={(aktenEintrag, personType) => loadPostenFromAkte(aktenEintrag)}
              defaultPersonType="verstorbener"
              title="Wähle eine Akte aus"
              searchPlaceholder="Nach Akte mit Posten suchen..."
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Angehörige Tab Komponente
function AngehoerigeTab({
  data,
  setData,
  auftraggeberData,
  onAddressLookup
}: {
  data: AngehoerigeData
  setData: (data: AngehoerigeData) => void
  auftraggeberData: PersonData
  onAddressLookup: (query: string, targetSetter: any) => void
}) {
  const updateField = (field: keyof AngehoerigeData, value: any) => {
    setData({ ...data, [field]: value })
  }

  const addAngehoeriger = () => {
    const newAngehoeriger: AngehoerigerData = {
      id: `ang-${Date.now()}`,
      verwandschaftsgrad: '',
      istMinderjährig: false,
      istAuftraggeber: false
    }
    
    updateField('angehoerige', [...data.angehoerige, newAngehoeriger])
  }

  const updateAngehoeriger = (id: string, field: keyof AngehoerigerData, value: any) => {
    const updatedAngehoerige = data.angehoerige.map(ang => 
      ang.id === id ? { ...ang, [field]: value } : ang
    )
    updateField('angehoerige', updatedAngehoerige)
  }

  const removeAngehoeriger = (id: string) => {
    const updatedAngehoerige = data.angehoerige.filter(ang => ang.id !== id)
    updateField('angehoerige', updatedAngehoerige)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <Users className="w-8 h-8 text-corda-gold" />
        <div>
          <h2 className="text-2xl font-bold text-white">Angehörige</h2>
          <p className="text-gray-400">Verwandte und Angehörige des Verstorbenen</p>
        </div>
      </div>

      {/* Kinder-Abfrage */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Kinder des Verstorbenen</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.kinderVorhanden || false}
              onChange={(e) => updateField('kinderVorhanden', e.target.checked)}
              className="w-5 h-5 text-corda-gold bg-gray-800 border-gray-600 rounded focus:ring-corda-gold focus:ring-2"
            />
            <span className="text-white font-medium">Der Verstorbene hatte Kinder</span>
          </div>

          {data.kinderVorhanden && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Anzahl Kinder gesamt
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={data.anzahlKinder || ''}
                  onChange={(e) => updateField('anzahlKinder', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Davon minderjährig (unter 18)
                </label>
                <input
                  type="number"
                  min="0"
                  max={data.anzahlKinder || 20}
                  value={data.anzahlMinderjaehrigeKinder || ''}
                  onChange={(e) => updateField('anzahlMinderjaehrigeKinder', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold"
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Angehörige Liste */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Angehörige erfassen</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addAngehoeriger}
            className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-semibold px-4 py-2 rounded-lg shadow-lg shadow-corda-gold/25 hover:shadow-corda-gold/40 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Angehörigen hinzufügen</span>
          </motion.button>
        </div>

        {data.angehoerige.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Noch keine Angehörigen erfasst</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.angehoerige.map((angehoeriger, index) => (
              <motion.div
                key={angehoeriger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Angehöriger {index + 1}</h4>
                  <button
                    onClick={() => removeAngehoeriger(angehoeriger.id)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <InputField
                    label="Verwandschaftsgrad"
                    value={angehoeriger.verwandschaftsgrad}
                    onChange={(value) => updateAngehoeriger(angehoeriger.id, 'verwandschaftsgrad', value)}
                    type="select"
                    options={['Kind', 'Ehepartner', 'Elternteil', 'Geschwister', 'Großeltern', 'Enkel', 'Schwiegerkind', 'Schwiegereltern', 'Onkel/Tante', 'Neffe/Nichte', 'Cousin/Cousine', 'Sonstiges']}
                    required
                  />
                  
                  <InputField
                    label="Anrede"
                    value={angehoeriger.anrede}
                    onChange={(value) => updateAngehoeriger(angehoeriger.id, 'anrede', value)}
                    type="select"
                    options={['Herr', 'Frau', 'Divers']}
                  />
                  
                  <InputField
                    label="Titel"
                    value={angehoeriger.titel}
                    onChange={(value) => updateAngehoeriger(angehoeriger.id, 'titel', value)}
                    type="select"
                    options={['Dr.', 'Prof.', 'Prof. Dr.', 'Dr. med.', 'Dr. phil.', 'Dipl.-Ing.', 'Dipl.-Kfm.', 'Mag.', 'B.A.', 'M.A.', 'B.Sc.', 'M.Sc.']}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputField
                    label="Vorname(n)"
                    value={angehoeriger.vornamen}
                    onChange={(value) => updateAngehoeriger(angehoeriger.id, 'vornamen', value)}
                    placeholder="Vorname(n)"
                  />
                  
                  <InputField
                    label="Nachname"
                    value={angehoeriger.nachname}
                    onChange={(value) => updateAngehoeriger(angehoeriger.id, 'nachname', value)}
                    placeholder="Nachname"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Sterbeort Autocomplete Komponente
function SterbeortAutocompleteField({
  sterbeortTyp,
  value,
  onChange,
  verstorbenerAdresse,
  placeholder = "Sterbeort eingeben...",
  className = ''
}: {
  sterbeortTyp: string
  value?: string
  onChange: (value: string, addressData?: any) => void
  verstorbenerAdresse: PersonData
  placeholder?: string
  className?: string
}) {
  if (sterbeortTyp === 'Eigene Wohnung') {
    const adresse = `${verstorbenerAdresse.strasse} ${verstorbenerAdresse.hausnummer}, ${verstorbenerAdresse.plz} ${verstorbenerAdresse.ort}`
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-300">Sterbeort-Details</label>
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-300">
          {adresse}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">Sterbeort-Details</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
      />
    </div>
  )
}

// Obduktionsort Autocomplete Komponente
function ObduktionsortAutocompleteField({
  label,
  value,
  onChange,
  placeholder = "Klinik/Institut suchen...",
  className = ''
}: {
  label: string
  value?: string
  onChange: (value: string, addressData?: any) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
      />
    </div>
  )
}

// Krematorium Autocomplete Komponente
function KrematoriumAutocompleteField({
  label,
  value,
  onChange,
  placeholder = "Krematorium suchen...",
  className = ''
}: {
  label: string
  value?: string
  onChange: (value: string, addressData?: any) => void
  placeholder?: string
  className?: string
}) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setInputValue(value || '') }, [value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchKrematorien = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]); setShowSuggestions(false); return
    }

    // Prüfen, ob der Nutzer bereits einschlägige Keywords eingegeben hat
    const kws = ['kremator', 'cremator', 'feuerbestatt']
    const hasKeyword = kws.some(k => query.toLowerCase().includes(k))

    // Falls nicht, hänge "krematorium" an, damit die Google-API dennoch passende Treffer liefert
    const searchInput = hasKeyword ? query : `${query} krematorium`

    setIsLoading(true)
    try {
      let res = await fetch('/api/places-autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: searchInput, includedPrimaryTypes: ['funeral_home', 'cemetery'], languageCode: 'de', regionCode: 'DE' })
      })
      if (!res.ok) throw new Error('API Error ' + res.status)
      let data = await res.json()
      // Ergebnisse weiterhin nach relevanten Keywords filtern, um Bestattungsinstitute auszuschließen
      let filtered = (data.suggestions || []).filter((s: any) => {
        const txt = `${s.fullText || s.text || ''} ${s.mainText || ''} ${s.secondaryText || ''}`.toLowerCase()
        return kws.some(k => txt.includes(k))
      })

      // Fallback: wenn keine Ergebnisse, erneut ohne Typfilter suchen
      if (filtered.length === 0) {
        res = await fetch('/api/places-autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: searchInput, languageCode: 'de', regionCode: 'DE' })
        })
        if (res.ok) {
          data = await res.json()
          filtered = (data.suggestions || []).filter((s: any) => {
            const txt = `${s.fullText || s.text || ''} ${s.mainText || ''} ${s.secondaryText || ''}`.toLowerCase()
            return kws.some(k => txt.includes(k))
          })
        }
      }
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setActiveSuggestionIndex(-1)
    } catch (err) {
      console.error('Krematorium-Suche Fehler:', err)
      setSuggestions([]); setShowSuggestions(false)
    } finally { setIsLoading(false) }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => searchKrematorien(v), 300)
  }

  const handleSuggestionClick = async (s: any) => {
    let displayText = s.text || s.fullText || s.mainText
    let addressData: any = { name: s.mainText || s.text, address: displayText, place_id: s.placeId, geometry: null }
    if (s.placeId) {
      try {
        const res = await fetch(`/api/places-autocomplete?placeId=${encodeURIComponent(s.placeId)}`)
        if (res.ok) {
          const d = await res.json(); addressData = { ...addressData, ...d, address: d.formatted_address || displayText }
        }
      } catch {}
    }
    setInputValue(addressData.name || displayText)
    onChange(addressData.name || displayText, addressData)
    setShowSuggestions(false); setActiveSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActiveSuggestionIndex(i => i < suggestions.length - 1 ? i + 1 : 0); break
      case 'ArrowUp': e.preventDefault(); setActiveSuggestionIndex(i => i > 0 ? i - 1 : suggestions.length - 1); break
      case 'Enter': e.preventDefault(); if (activeSuggestionIndex >= 0) handleSuggestionClick(suggestions[activeSuggestionIndex]); break
      case 'Escape': setShowSuggestions(false); setActiveSuggestionIndex(-1); break
    }
  }

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionRefs.current[activeSuggestionIndex]) {
      suggestionRefs.current[activeSuggestionIndex]!.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeSuggestionIndex])

  return (
    <div className={`space-y-2 ${className}`} ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-corda-gold"></div>) : (<Search className="h-4 w-4 text-gray-400" />)}
          </div>
        </div>
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
            {suggestions.length > 0 ? (
              <ul className="py-1">
                {suggestions.map((s, idx) => (
                  <li
                    key={s.placeId}
                    ref={el => { suggestionRefs.current[idx] = el }}
                    onClick={() => handleSuggestionClick(s)}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-700/50 last:border-b-0 ${idx === activeSuggestionIndex ? 'bg-corda-gold/20 text-corda-gold' : 'text-gray-200 hover:bg-gray-700/40'}`}
                  >
                    <div className="font-medium text-sm truncate">{s.mainText || s.text}</div>
                    {s.secondaryText && (<div className="text-xs text-gray-400 mt-1 truncate">{s.secondaryText}</div>)}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-gray-400 text-sm">Keine Krematorien gefunden</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Friedhof Autocomplete Komponente
function FriedhofAutocompleteField({
  label,
  value,
  onChange,
  bestattungsart,
  placeholder = "Friedhof suchen...",
  className = ''
}: {
  label: string
  value?: string
  onChange: (value: string, addressData?: any) => void
  bestattungsart: string
  placeholder?: string
  className?: string
}) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const searchFriedhoefe = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/places-autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: query,
          includedPrimaryTypes: ['cemetery'],
          languageCode: 'de',
          regionCode: 'DE'
        })
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions((data.suggestions || []).length > 0)
      setActiveSuggestionIndex(-1)
    } catch (error) {
      console.error('Fehler bei der Friedhof-Suche:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchFriedhoefe(newValue)
    }, 300)
  }

  const handleSuggestionClick = async (suggestion: any) => {
    // Wenn PlaceId vorhanden, Details abrufen
    let displayText = suggestion.text || suggestion.fullText || suggestion.mainText
    let addressData: any = {
      name: suggestion.mainText || suggestion.text,
      address: displayText,
      place_id: suggestion.placeId,
      geometry: null
    }

    if (suggestion.placeId) {
      try {
        const res = await fetch(`/api/places-autocomplete?placeId=${encodeURIComponent(suggestion.placeId)}`)
        if (res.ok) {
          const details = await res.json()
          addressData.address = details.formatted_address || displayText
          addressData = { ...addressData, ...details }
        }
      } catch (e) {
        console.error('Details API error:', e)
      }
    }

    setInputValue(addressData.name || displayText)
    onChange(addressData.name || displayText, addressData)
    setShowSuggestions(false)
    setActiveSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleSuggestionClick(suggestions[activeSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionRefs.current[activeSuggestionIndex]) {
      suggestionRefs.current[activeSuggestionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [activeSuggestionIndex])

  return (
    <div className={`space-y-2 ${className}`} ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-2 focus:ring-corda-gold/20 transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-corda-gold"></div>
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
            <ul className="py-1">
              {suggestions.map((place, index) => (
                                 <li
                   key={place.place_id}
                   ref={el => { suggestionRefs.current[index] = el }}
                   onClick={() => handleSuggestionClick(place)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-700/50 last:border-b-0 ${
                    index === activeSuggestionIndex 
                      ? 'bg-corda-gold/20 text-corda-gold' 
                      : 'text-gray-200 hover:bg-gray-700/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {place.mainText || place.text}
                      </div>
                      {place.secondaryText && (
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {place.secondaryText}
                        </div>
                      )}
                      {place.rating && (
                        <div className="flex items-center mt-1 text-xs text-yellow-400">
                          ⭐ {place.rating}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showSuggestions && suggestions.length === 0 && !isLoading && inputValue.trim().length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl">
            <div className="px-4 py-3 text-gray-400 text-sm">
              Keine Friedhöfe gefunden
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortierbare Posten-Komponente mit Drag & Drop
function SortablePostenItem({ 
  posten, 
  updatePosten, 
  removePosten, 
  kategorien 
}: { 
  posten: PostenData
  updatePosten: (id: string, field: keyof PostenData, value: any) => void
  removePosten: (id: string) => void
  kategorien: string[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ 
    id: posten.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: isDragging 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" 
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.15 }
      }}
      className={`bg-gray-700/20 rounded-lg p-3 transition-all duration-200 ${
        isDragging 
          ? 'opacity-80 bg-gray-600/60 border-2 border-corda-gold/50 z-50' 
          : 'hover:bg-gray-700/40'
      } ${isOver ? 'bg-corda-gold/10 border border-corda-gold/30' : ''}`}
    >
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Drag Handle mit Animation */}
        <div className="col-span-1 flex items-center justify-center h-10">
          <motion.button
            {...attributes}
            {...listeners}
            whileHover={{ 
              scale: 1.1,
              color: "#D4AF37",
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`text-gray-400 hover:text-corda-gold cursor-grab active:cursor-grabbing p-1 transition-colors duration-200 rounded ${
              isDragging ? 'text-corda-gold' : ''
            }`}
          >
            <GripVertical className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="col-span-3">
          <input
            type="text"
            value={posten.bezeichnung}
            onChange={(e) => updatePosten(posten.id, 'bezeichnung', e.target.value)}
            placeholder="Bezeichnung"
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold h-10 transition-all duration-200"
          />
          {posten.beschreibung && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center mt-1 text-xs text-blue-400"
            >
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{posten.beschreibung}</span>
            </motion.div>
          )}
        </div>

        <div className="col-span-2">
          <select
            value={posten.kategorie || 'Sonstiges'}
            onChange={(e) => updatePosten(posten.id, 'kategorie', e.target.value)}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:border-corda-gold focus:ring-1 focus:ring-corda-gold h-10 transition-all duration-200"
          >
            {kategorien.map(kat => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
        
        <div className="col-span-2">
          <input
            type="number"
            value={posten.einzelpreis}
            onChange={(e) => updatePosten(posten.id, 'einzelpreis', parseFloat(e.target.value) || 0)}
            placeholder="Einzelpreis"
            step="0.01"
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold h-10 transition-all duration-200"
          />
        </div>
        
        <div className="col-span-1">
          <input
            type="number"
            value={posten.anzahl}
            onChange={(e) => updatePosten(posten.id, 'anzahl', parseInt(e.target.value) || 1)}
            placeholder="Anz."
            min="1"
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-corda-gold focus:ring-1 focus:ring-corda-gold h-10 transition-all duration-200"
          />
        </div>
        
        <div className="col-span-2 flex items-center h-10">
          <motion.div 
            className="text-white font-semibold text-right w-full"
            animate={{ 
              color: isDragging ? '#D4AF37' : '#FFFFFF',
              scale: isDragging ? 1.05 : 1 
            }}
            transition={{ duration: 0.2 }}
          >
            {posten.gesamtpreis.toFixed(2)} €
          </motion.div>
        </div>
        
        <div className="col-span-1 text-right flex items-center justify-end h-10">
          <motion.button
            onClick={() => removePosten(posten.id)}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.9 }}
            className="text-red-400 hover:text-red-300 p-1 transition-colors duration-200 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
