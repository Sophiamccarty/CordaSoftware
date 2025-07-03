'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Users, 
  Church, 
  CreditCard,
  Eye,
  FileText,
  Building,
  Package,
  Calculator,
  X,
  CheckCircle
} from 'lucide-react'

interface SterbefallVorschauProps {
  data: {
    auftrag: any
    verstorbener: any
    auftraggeber: any
    ehepartner: any
    angehoerige?: any
    bestattung: any
    posten: any[]
    fallNummer: string
    status: string
  }
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SterbefallVorschau({ data, isOpen, onClose, onConfirm }: SterbefallVorschauProps) {
  if (!isOpen) return null

  // Berechne Gesamtsumme
  const gesamtsumme = data.posten.reduce((sum, posten) => sum + posten.gesamtpreis, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-corda-gold to-yellow-500 text-black p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sterbefall-Vorschau</h2>
              <p className="text-black/70">Fall-Nr: {data.fallNummer}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verstorbener */}
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Verstorbener</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">
                      {data.verstorbener.anrede} {data.verstorbener.titel} {data.verstorbener.vornamen} {data.verstorbener.nachname}
                    </p>
                    {data.verstorbener.geburtsname && (
                      <p className="text-gray-400 text-sm">geb. {data.verstorbener.geburtsname}</p>
                    )}
                  </div>
                </div>
                
                {(data.verstorbener.geburtsdatum || data.verstorbener.verstorbenAm) && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      {data.verstorbener.geburtsdatum && (
                        <p className="text-gray-300 text-sm">
                          * {new Date(data.verstorbener.geburtsdatum).toLocaleDateString('de-DE')}
                        </p>
                      )}
                      {data.verstorbener.verstorbenAm && (
                        <p className="text-gray-300 text-sm">
                          † {new Date(data.verstorbener.verstorbenAm).toLocaleDateString('de-DE')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {(data.verstorbener.strasse || data.verstorbener.ort) && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300 text-sm">
                        {data.verstorbener.strasse} {data.verstorbener.hausnummer}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {data.verstorbener.plz} {data.verstorbener.ort}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auftraggeber */}
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Auftraggeber</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">
                      {data.auftraggeber.anrede} {data.auftraggeber.titel} {data.auftraggeber.vornamen} {data.auftraggeber.nachname}
                    </p>
                  </div>
                </div>
                
                {(data.auftraggeber.strasse || data.auftraggeber.ort) && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300 text-sm">
                        {data.auftraggeber.strasse} {data.auftraggeber.hausnummer}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {data.auftraggeber.plz} {data.auftraggeber.ort}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bestattung */}
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Church className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Bestattung</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{data.bestattung.bestattungsart}</p>
                    {data.bestattung.datum && (
                      <p className="text-gray-300 text-sm">
                        am {new Date(data.bestattung.datum).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                </div>
                
                {data.bestattung.friedhofMeer && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300 text-sm">{data.bestattung.friedhofMeer}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Auftrag */}
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Auftrag</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Sachbearbeiter</p>
                    <p className="text-gray-300 text-sm">{data.auftrag.sachbearbeiter}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Filiale</p>
                    <p className="text-gray-300 text-sm">{data.auftrag.filiale}</p>
                  </div>
                </div>
                
                {data.auftrag.hatVorsorge && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 font-medium">Vorsorge vorhanden</p>
                      {data.auftrag.vorsorgeNummer && (
                        <p className="text-gray-300 text-sm">Nr: {data.auftrag.vorsorgeNummer}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posten */}
          {data.posten.length > 0 && (
            <div className="glass-morphism rounded-xl p-6 mt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Posten</h3>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data.posten.map((posten, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-medium">{posten.bezeichnung}</p>
                      <p className="text-gray-400 text-sm">{posten.typ}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{posten.anzahl}x</p>
                      <p className="text-gray-400 text-sm">{posten.einzelpreis.toFixed(2)} €</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-corda-gold font-bold">{posten.gesamtpreis.toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-corda-gold" />
                    <span className="text-xl font-bold text-white">Gesamtsumme</span>
                  </div>
                  <span className="text-2xl font-bold text-corda-gold">
                    {gesamtsumme.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Status: <span className="text-corda-gold font-semibold">{data.status}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Schließen
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="px-8 py-3 bg-gradient-to-r from-corda-gold to-yellow-500 text-black font-bold rounded-xl shadow-lg hover:shadow-corda-gold/25 transition-all duration-200"
              >
                Bestätigen & Anlegen
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}