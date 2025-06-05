import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface PostenListeData {
  id: string
  name: string
  beschreibung?: string
  posten: any[]
  istSystemliste: boolean
  erstelltVon?: string
  erstelltAm?: string
}

// Get data directory from environment or default
const DATA_DIR = process.env.CORDA_DATA_PATH || 
  (process.env.NODE_ENV === 'production' ? '/var/data/corda' : path.join(process.cwd(), 'var/data/corda'))

const LISTEN_DIR = path.join(DATA_DIR, 'listen')
const SYSTEM_LISTEN_FILE = path.join(LISTEN_DIR, 'system.json')
const USER_LISTEN_FILE = path.join(LISTEN_DIR, 'benutzer.json')

// Ensure listen directory structure exists
async function ensureListenStructure() {
  try {
    await fs.mkdir(LISTEN_DIR, { recursive: true })
    
    // Create initial files if they don't exist
    const files = [
      { path: SYSTEM_LISTEN_FILE, content: [] },
      { path: USER_LISTEN_FILE, content: [] }
    ]

    for (const file of files) {
      try {
        await fs.access(file.path)
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.content, null, 2))
      }
    }
  } catch (error) {
    console.error('Error ensuring listen structure:', error)
  }
}

// Read listen from file
async function readListen(isSystem: boolean): Promise<PostenListeData[]> {
  try {
    await ensureListenStructure()
    const filePath = isSystem ? SYSTEM_LISTEN_FILE : USER_LISTEN_FILE
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading listen:', error)
    return []
  }
}

// Write listen to file
async function writeListen(listen: PostenListeData[], isSystem: boolean): Promise<void> {
  try {
    await ensureListenStructure()
    const filePath = isSystem ? SYSTEM_LISTEN_FILE : USER_LISTEN_FILE
    await fs.writeFile(filePath, JSON.stringify(listen, null, 2))
  } catch (error) {
    console.error('Error writing listen:', error)
    throw error
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// GET - Retrieve all listen (system and user)
export async function GET() {
  try {
    const systemListen = await readListen(true)
    const userListen = await readListen(false)
    
    return NextResponse.json({
      systemListen,
      userListen,
      all: [...systemListen, ...userListen]
    })
  } catch (error) {
    console.error('GET /api/listen error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve listen' },
      { status: 500 }
    )
  }
}

// POST - Create new liste
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.posten) {
      return NextResponse.json(
        { error: 'Missing required fields (name, posten)' },
        { status: 400 }
      )
    }

    const isSystem = body.istSystemliste || false
    const listen = await readListen(isSystem)
    
    // Check if name already exists
    const existingListe = listen.find(liste => liste.name === body.name)
    if (existingListe) {
      return NextResponse.json(
        { error: 'Liste name already exists' },
        { status: 409 }
      )
    }

    const newListe: PostenListeData = {
      id: generateId(),
      name: body.name,
      beschreibung: body.beschreibung,
      posten: body.posten,
      istSystemliste: isSystem,
      erstelltVon: body.erstelltVon || 'Unknown',
      erstelltAm: new Date().toISOString()
    }

    listen.push(newListe)
    await writeListen(listen, isSystem)

    return NextResponse.json(newListe, { status: 201 })
  } catch (error) {
    console.error('POST /api/listen error:', error)
    return NextResponse.json(
      { error: 'Failed to create liste' },
      { status: 500 }
    )
  }
}

// PUT - Update existing liste
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing ID' },
        { status: 400 }
      )
    }

    // Try to find in both system and user listen
    let listen = await readListen(true)
    let index = listen.findIndex(liste => liste.id === body.id)
    let isSystem = true

    if (index === -1) {
      listen = await readListen(false)
      index = listen.findIndex(liste => liste.id === body.id)
      isSystem = false
    }
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Liste not found' },
        { status: 404 }
      )
    }

    const updatedListe = {
      ...listen[index],
      ...body,
      istSystemliste: isSystem // Prevent changing system status
    }

    listen[index] = updatedListe
    await writeListen(listen, isSystem)

    return NextResponse.json(updatedListe)
  } catch (error) {
    console.error('PUT /api/listen error:', error)
    return NextResponse.json(
      { error: 'Failed to update liste' },
      { status: 500 }
    )
  }
}

// DELETE - Remove liste
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      )
    }

    // Try to find in user listen first (system listen shouldn't be deleted easily)
    let listen = await readListen(false)
    let index = listen.findIndex(liste => liste.id === id)
    let isSystem = false

    if (index === -1) {
      listen = await readListen(true)
      index = listen.findIndex(liste => liste.id === id)
      isSystem = true
      
      // Additional protection for system listen
      if (index !== -1) {
        return NextResponse.json(
          { error: 'Cannot delete system liste' },
          { status: 403 }
        )
      }
    }
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Liste not found' },
        { status: 404 }
      )
    }

    const deletedListe = listen[index]
    listen.splice(index, 1)
    await writeListen(listen, isSystem)

    return NextResponse.json({ 
      message: 'Liste deleted successfully', 
      deleted: deletedListe 
    })
  } catch (error) {
    console.error('DELETE /api/listen error:', error)
    return NextResponse.json(
      { error: 'Failed to delete liste' },
      { status: 500 }
    )
  }
} 