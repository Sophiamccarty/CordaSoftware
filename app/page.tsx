'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Shield, Zap, Brain, Users, Clock, Star } from 'lucide-react'
import LoginForm, { LoginFormRef } from '@/components/auth/LoginForm'

export default function HomePage() {
  const [isTestMode, setIsTestMode] = useState(false)
  const router = useRouter()
  const loginFormRef = useRef<LoginFormRef>(null)

  useEffect(() => {
    // Check if we're in localhost test mode
    setIsTestMode(process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost')
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "20-Minuten-Workflow",
      description: "Komplette Sterbefallbearbeitung in nur 20 Minuten statt ganzen Tagen"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "KI-Assistent",
      description: "Automatische Generierung von Trauerreden, Anzeigen und Danksagungen"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Behörden-Automatisierung",
      description: "Vollautomatische Abwicklung aller behördlichen Angelegenheiten"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Tenant System",
      description: "Jede Firma erhält ihr eigenes sicheres Portal"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Echtzeit-Synchronisation",
      description: "Arbeiten Sie von überall mit Live-Updates"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium-Erfahrung",
      description: "Elegantes, modernes Interface für professionelle Bestatter"
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-corda-black via-corda-anthracite to-corda-dark" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-corda-gold/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                x: Math.random() * 800,
                y: Math.random() * 600,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <Heart className="w-12 h-12 text-corda-gold" />
              <h1 className="text-5xl font-serif font-bold text-gradient">
                CORDA
              </h1>
            </div>
            
            <h2 className="text-3xl font-light text-corda-white mb-6">
              Die revolutionäre Bestattungssoftware
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Transformieren Sie Ihr Bestattungsunternehmen mit KI-gestützter Automatisierung, 
              elegantem Design und revolutionären Workflows.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="glass-effect p-4 rounded-lg"
              >
                <div className="text-corda-gold mb-2">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-corda-white text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-12">
            <Heart className="w-10 h-10 text-corda-gold" />
            <h1 className="text-4xl font-serif font-bold text-gradient">
              CORDA
            </h1>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-corda-white mb-2">
                Willkommen zurück
              </h2>
              <p className="text-gray-400">
                Melden Sie sich in Ihrem CORDA Account an
              </p>
            </div>

            <LoginForm ref={loginFormRef} />

            {isTestMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg"
              >
                <h3 className="text-blue-300 font-medium mb-2 text-sm">
                  🧪 Testmodus (nur localhost)
                </h3>
                <p className="text-blue-200 text-xs mb-3">
                  Schnellanmeldung für Tests verfügbar:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { user: 'admin', password: 'CordaAdmin2024!', role: 'Administrator' },
                    { user: 'geschaeftsfuehrung', password: 'Geschaeftsfuehrung123!', role: 'Geschäftsführung' },
                    { user: 'manager', password: 'Manager123!', role: 'Manager' },
                    { user: 'mitarbeiter', password: 'Mitarbeiter123!', role: 'Mitarbeiter' },
                    { user: 'aushilfe', password: 'Aushilfe123!', role: 'Aushilfe' },
                  ].map((test) => (
                    <button
                      key={test.user}
                      onClick={() => {
                        // Use the ref to set credentials properly
                        loginFormRef.current?.setCredentials(test.user, test.password)
                      }}
                      className="text-left p-2 bg-blue-800/30 hover:bg-blue-700/30 rounded border border-blue-600/30 hover:border-blue-500/50 transition-all"
                    >
                      <div className="text-blue-200 font-medium">{test.user}</div>
                      <div className="text-blue-300">{test.role}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © 2024 CORDA. Die Zukunft der Bestattungsbranche.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 