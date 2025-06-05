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
  fallNummer: string
  status: string
  createdAt: string
  updatedAt?: string
}

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/var/data/corda' : path.join(process.cwd(), 'var/data/corda')
const STERBEFAELLE_FILE = path.join(DATA_DIR, 'sterbefaelle.json')

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    
    try {
      await fs.access(STERBEFAELLE_FILE)
    } catch {
      await fs.writeFile(STERBEFAELLE_FILE, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error ensuring data file:', error)
  }
}

// Read Sterbefälle from file
async function readSterbefaelle(): Promise<SterbefallData[]> {
  try {
    await ensureDataFile()
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
    await ensureDataFile()
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
export async function GET() {
  try {
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