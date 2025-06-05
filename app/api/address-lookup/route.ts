import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyA9249SIWOGoAUWVM0ACq77BYkziRp5xaI'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] })
    }

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockResults = [
        {
          description: `${query} 1, 12345 Musterstadt`,
          place_id: 'mock_1',
          structured_formatting: {
            main_text: `${query} 1`,
            secondary_text: '12345 Musterstadt'
          }
        },
        {
          description: `${query} 15, 54321 Teststadt`,
          place_id: 'mock_2',
          structured_formatting: {
            main_text: `${query} 15`,
            secondary_text: '54321 Teststadt'
          }
        }
      ]
      
      return NextResponse.json({ results: mockResults })
    }

    // Production: Use Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&language=de&components=country:de&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('Google Places API request failed')
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      results: data.predictions || []
    })
    
  } catch (error) {
    console.error('Address lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup address' },
      { status: 500 }
    )
  }
}

// GET place details
export async function POST(request: NextRequest) {
  try {
    const { place_id } = await request.json()
    
    if (!place_id) {
      return NextResponse.json(
        { error: 'Missing place_id' },
        { status: 400 }
      )
    }

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockDetail = {
        result: {
          address_components: [
            { long_name: '123', types: ['street_number'] },
            { long_name: 'Musterstraße', types: ['route'] },
            { long_name: 'Musterstadt', types: ['locality'] },
            { long_name: '12345', types: ['postal_code'] }
          ]
        }
      }
      
      return NextResponse.json(mockDetail)
    }

    // Production: Use Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=address_components&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('Google Places Details API request failed')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Place details error:', error)
    return NextResponse.json(
      { error: 'Failed to get place details' },
      { status: 500 }
    )
  }
} 