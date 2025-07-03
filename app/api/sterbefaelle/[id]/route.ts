import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Get data directory from environment or default
const DATA_DIR = process.env.CORDA_DATA_PATH || 
  (process.env.NODE_ENV === 'production' ? '/var/data/corda' : path.join(process.cwd(), 'var/data/corda'))

const STERBEFAELLE_FILE = path.join(DATA_DIR, 'sterbefaelle.json')

// Get single Sterbefall by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure data structure exists
    await ensureDataStructure()
    
    // Read existing data
    let sterbefaelle = []
    try {
      const data = await fs.readFile(STERBEFAELLE_FILE, 'utf8')
      sterbefaelle = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, return empty array
      sterbefaelle = []
    }
    
    // Find the specific Sterbefall
    const sterbefall = sterbefaelle.find((s: any) => s.id === params.id)
    
    if (!sterbefall) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(sterbefall)
  } catch (error) {
    console.error('Error fetching Sterbefall:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update single Sterbefall by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedData = await request.json()
    
    // Ensure data structure exists
    await ensureDataStructure()
    
    // Read existing data
    let sterbefaelle = []
    try {
      const data = await fs.readFile(STERBEFAELLE_FILE, 'utf8')
      sterbefaelle = JSON.parse(data)
    } catch (error) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }
    
    // Find and update the specific Sterbefall
    const index = sterbefaelle.findIndex((s: any) => s.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }
    
    // Update the sterbefall with new data
    sterbefaelle[index] = {
      ...sterbefaelle[index],
      ...updatedData,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }
    
    // Write updated data back to file
    await fs.writeFile(STERBEFAELLE_FILE, JSON.stringify(sterbefaelle, null, 2))
    
    // Log the update
    await logAccess('UPDATE', `Sterbefall ${params.id} updated`)
    
    return NextResponse.json(sterbefaelle[index])
  } catch (error) {
    console.error('Error updating Sterbefall:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete single Sterbefall by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure data structure exists
    await ensureDataStructure()
    
    // Read existing data
    let sterbefaelle = []
    try {
      const data = await fs.readFile(STERBEFAELLE_FILE, 'utf8')
      sterbefaelle = JSON.parse(data)
    } catch (error) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }
    
    // Find the specific Sterbefall
    const index = sterbefaelle.findIndex((s: any) => s.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Sterbefall not found' },
        { status: 404 }
      )
    }
    
    // Remove the sterbefall
    const deletedSterbefall = sterbefaelle.splice(index, 1)[0]
    
    // Write updated data back to file
    await fs.writeFile(STERBEFAELLE_FILE, JSON.stringify(sterbefaelle, null, 2))
    
    // Log the deletion
    await logAccess('DELETE', `Sterbefall ${params.id} deleted`)
    
    return NextResponse.json(deletedSterbefall)
  } catch (error) {
    console.error('Error deleting Sterbefall:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to ensure data structure exists
async function ensureDataStructure() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
  
  // Ensure sterbefaelle.json exists
  try {
    await fs.access(STERBEFAELLE_FILE)
  } catch {
    await fs.writeFile(STERBEFAELLE_FILE, '[]')
  }
}

// Helper function to log access
async function logAccess(action: string, details: string) {
  try {
    const logsDir = path.join(DATA_DIR, 'logs')
    await fs.mkdir(logsDir, { recursive: true })
    
    const logFile = path.join(logsDir, 'access.log')
    const logEntry = `${new Date().toISOString()} - ${action} - ${details}\n`
    
    await fs.appendFile(logFile, logEntry)
  } catch (error) {
    console.error('Error logging access:', error)
  }
}