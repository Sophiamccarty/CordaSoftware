import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Define interface for Sterbefall data
interface SterbefallData {
  id?: string
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

// Get data directory from environment or default
const DATA_DIR = process.env.CORDA_DATA_PATH || 
  (process.env.NODE_ENV === 'production' ? '/var/data/corda' : path.join(process.cwd(), 'var/data/corda'))

// Define all data paths according to structure
const STERBEFAELLE_FILE = path.join(DATA_DIR, 'sterbefaelle.json')
const STERBEFAELLE_DIR = path.join(DATA_DIR, 'sterbefaelle')
const VORLAGEN_DIR = path.join(DATA_DIR, 'vorlagen')
const SYSTEM_VORLAGEN_DIR = path.join(VORLAGEN_DIR, 'system')
const USER_VORLAGEN_DIR = path.join(VORLAGEN_DIR, 'benutzer')
const LISTEN_DIR = path.join(DATA_DIR, 'listen')
const BACKUPS_DIR = path.join(DATA_DIR, 'backups')
const DAILY_BACKUPS_DIR = path.join(BACKUPS_DIR, 'daily')
const WEEKLY_BACKUPS_DIR = path.join(BACKUPS_DIR, 'weekly')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, 'dokumente')
const IMAGES_DIR = path.join(UPLOADS_DIR, 'bilder')
const LOGS_DIR = path.join(DATA_DIR, 'logs')

// Ensure complete data directory structure exists
async function ensureDataStructure() {
  try {
    // Create all necessary directories
    const directories = [
      DATA_DIR,
      STERBEFAELLE_DIR,
      VORLAGEN_DIR,
      SYSTEM_VORLAGEN_DIR,
      USER_VORLAGEN_DIR,
      LISTEN_DIR,
      BACKUPS_DIR,
      DAILY_BACKUPS_DIR,
      WEEKLY_BACKUPS_DIR,
      UPLOADS_DIR,
      DOCUMENTS_DIR,
      IMAGES_DIR,
      LOGS_DIR
    ]

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true })
    }

    // Create initial JSON files if they don't exist
    const initialFiles = [
      { path: STERBEFAELLE_FILE, content: [] },
      { path: path.join(LISTEN_DIR, 'system.json'), content: [] },
      { path: path.join(LISTEN_DIR, 'benutzer.json'), content: [] },
      { path: path.join(VORLAGEN_DIR, 'system.json'), content: [] },
      { path: path.join(VORLAGEN_DIR, 'benutzer.json'), content: [] }
    ]

    for (const file of initialFiles) {
      try {
        await fs.access(file.path)
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.content, null, 2))
      }
    }

    // Create initial log files
    const logFiles = [
      path.join(LOGS_DIR, 'access.log'),
      path.join(LOGS_DIR, 'error.log')
    ]

    for (const logFile of logFiles) {
      try {
        await fs.access(logFile)
      } catch {
        await fs.writeFile(logFile, '')
      }
    }

  } catch (error) {
    console.error('Error ensuring data structure:', error)
  }
}

// Create year/month directory structure for Sterbefälle
async function ensureSterbefallDirectories(datum: string) {
  try {
    const date = new Date(datum)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    
    const yearDir = path.join(STERBEFAELLE_DIR, year)
    const monthDir = path.join(yearDir, month)
    const activDir = path.join(STERBEFAELLE_DIR, 'aktiv')

    await fs.mkdir(yearDir, { recursive: true })
    await fs.mkdir(monthDir, { recursive: true })
    await fs.mkdir(activDir, { recursive: true })

    return { yearDir, monthDir, activDir }
  } catch (error) {
    console.error('Error creating Sterbefall directories:', error)
    return null
  }
}

// Log access attempts
async function logAccess(method: string, ip?: string) {
  try {
    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp} - ${method} - IP: ${ip || 'unknown'}\n`
    await fs.appendFile(path.join(LOGS_DIR, 'access.log'), logEntry)
  } catch (error) {
    console.error('Error logging access:', error)
  }
}

// Read Sterbefälle from file
async function readSterbefaelle(): Promise<SterbefallData[]> {
  try {
    await ensureDataStructure()
    const data = await fs.readFile(STERBEFAELLE_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading Sterbefälle:', error)
    return []
  }
}

// Write Sterbefälle to file
async function writeSterbefaelle(sterbefaelle: SterbefallData[]): Promise<void> {
  try {
    await ensureDataStructure()
    await fs.writeFile(STERBEFAELLE_FILE, JSON.stringify(sterbefaelle, null, 2))
  } catch (error) {
    console.error('Error writing Sterbefälle:', error)
    throw error
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// GET - Retrieve all Sterbefälle
export async function GET(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    await logAccess('GET', ip)
    
    const sterbefaelle = await readSterbefaelle()
    return NextResponse.json(sterbefaelle)
  } catch (error) {
    console.error('GET /api/sterbefaelle error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Sterbefälle' },
      { status: 500 }
    )
  }
}

// POST - Create new Sterbefall
export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    await logAccess('POST', ip)
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.fallNummer || !body.verstorbener || !body.auftrag) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sterbefaelle = await readSterbefaelle()
    
    // Check if fallNummer already exists
    const existingFall = sterbefaelle.find(fall => fall.fallNummer === body.fallNummer)
    if (existingFall) {
      return NextResponse.json(
        { error: 'Fall number already exists' },
        { status: 409 }
      )
    }

    const newSterbefall: SterbefallData = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Create year/month directories if needed
    const verstorbenAm = body.verstorbener?.verstorbenAm || new Date().toISOString()
    await ensureSterbefallDirectories(verstorbenAm)

    sterbefaelle.push(newSterbefall)
    await writeSterbefaelle(sterbefaelle)

    return NextResponse.json(newSterbefall, { status: 201 })
  } catch (error) {
    console.error('POST /api/sterbefaelle error:', error)
    return NextResponse.json(
      { error: 'Failed to create Sterbefall' },
      { status: 500 }
    )
  }
}

// PUT - Update existing Sterbefall
export async function PUT(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    await logAccess('PUT', ip)
    
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing ID' },
        { status: 400 }
      )
    }

    const sterbefaelle = await readSterbefaelle()
    const index = sterbefaelle.findIndex(fall => fall.id === body.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }

    const updatedSterbefall = {
      ...sterbefaelle[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    sterbefaelle[index] = updatedSterbefall
    await writeSterbefaelle(sterbefaelle)

    return NextResponse.json(updatedSterbefall)
  } catch (error) {
    console.error('PUT /api/sterbefaelle error:', error)
    return NextResponse.json(
      { error: 'Failed to update Sterbefall' },
      { status: 500 }
    )
  }
} 