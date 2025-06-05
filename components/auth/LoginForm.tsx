'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface LoginFormData {
  username: string
  password: string
}

export interface LoginFormRef {
  setCredentials: (username: string, password: string) => void
}

const LoginForm = forwardRef<LoginFormRef>((props, ref) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    setCredentials: (username: string, password: string) => {
      setFormData({
        username,
        password
      })
      setErrors({}) // Clear any errors
    }
  }))

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Benutzername ist erforderlich'
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Login attempt with:', formData) // Debug log
    
    if (!validateForm()) {
      console.log('Validation failed') // Debug log
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log('Sending login request...') // Debug log
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Login response:', data) // Debug log

      if (response.ok && data.success) {
        // Store token and user data
        localStorage.setItem('corda_token', data.token)
        localStorage.setItem('corda_user', JSON.stringify(data.user))
        
        toast.success(`Willkommen zurück, ${data.user.username}!`)
        
        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        console.log('Login failed:', data.error) // Debug log
        toast.error(data.error || 'Anmeldung fehlgeschlagen')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Benutzername
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`form-input w-full ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          placeholder="Ihr Benutzername"
          disabled={isLoading}
        />
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-error"
          >
            {errors.username}
          </motion.p>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Passwort
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input w-full pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            placeholder="Ihr Passwort"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-corda-gold transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-error"
          >
            {errors.password}
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Anmeldung...</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Anmelden</span>
          </>
        )}
      </motion.button>

      {/* Test Mode Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            Testmodus: Verwenden Sie die Schnellauswahl oben oder "test" als Passwort
          </p>
        </div>
      )}
    </form>
  )
})

export default LoginForm 