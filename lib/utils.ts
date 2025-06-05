import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// String utilities
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export function isValidPostalCode(code: string): boolean {
  const germanPostalCodeRegex = /^\d{5}$/
  return germanPostalCodeRegex.test(code)
}

// Local storage utilities
export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage errors
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage errors
  }
}

// API utilities
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    const token = getStorageItem('corda_token')
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Ein Fehler ist aufgetreten',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Netzwerkfehler',
    }
  }
}

// Form utilities
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    }
  })
  
  return formData
}

// Error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Ein unbekannter Fehler ist aufgetreten'
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Generate fallnummer
export function generateFallnummer(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `SF-${year}-${randomNum}`
}

// Generate vorsorgernummer  
export function generateVorsorgeNummer(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `VS-${year}-${randomNum}`
}

// Color utilities for status
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    ERFASSUNG: 'bg-blue-900/20 text-blue-300 border-blue-700/50',
    BEARBEITUNG: 'bg-yellow-900/20 text-yellow-300 border-yellow-700/50',
    BEHOERDEN: 'bg-purple-900/20 text-purple-300 border-purple-700/50',
    PLANUNG: 'bg-orange-900/20 text-orange-300 border-orange-700/50',
    TRAUERFEIER: 'bg-indigo-900/20 text-indigo-300 border-indigo-700/50',
    ABGESCHLOSSEN: 'bg-green-900/20 text-green-300 border-green-700/50',
    INTERESSENT: 'bg-gray-900/20 text-gray-300 border-gray-700/50',
    BERATUNG: 'bg-blue-900/20 text-blue-300 border-blue-700/50',
    VERTRAGSABSCHLUSS: 'bg-yellow-900/20 text-yellow-300 border-yellow-700/50',
    AKTIV: 'bg-green-900/20 text-green-300 border-green-700/50',
  }
  
  return statusColors[status] || 'bg-gray-900/20 text-gray-300 border-gray-700/50'
} 