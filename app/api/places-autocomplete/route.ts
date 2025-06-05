import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = 'AIzaSyBP_Pni6_caIe4iPsI_h4jT_Hq8bqNK-L8'

export async function POST(request: NextRequest) {
  let body: any = {}
  
  try {
    body = await request.json()
    const { 
      input, 
      includedPrimaryTypes = [], 
      locationBias = null,
      languageCode = 'de',
      regionCode = 'DE'
    } = body
    
    if (!input || input.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Use real Google Places API
    const placesApiUrl = 'https://places.googleapis.com/v1/places:autocomplete'
    
    // Build request body for Google Places API
    const requestBody: any = {
      input,
      languageCode,
      regionCode
    }

    // Handle different search types
    if (includedPrimaryTypes && includedPrimaryTypes.length > 0 && includedPrimaryTypes[0] !== 'address') {
      // For specific place types (hospital, nursing_home, etc.)
      requestBody.includedPrimaryTypes = includedPrimaryTypes
    }
    // For 'address' type, we don't set includedPrimaryTypes to get general address results

    if (locationBias) {
      requestBody.locationBias = locationBias
    } else {
      // Default location bias for Germany
      requestBody.locationBias = {
        circle: {
          center: {
            latitude: 51.1657,
            longitude: 10.4515
          },
          radius: 50000.0  // Max 50km radius allowed by Google Places API
        }
      }
    }

    console.log('Google Places API Request:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(placesApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Places API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
        requestBody: JSON.stringify(requestBody, null, 2)
      })
      
      // Fallback to mock data if API fails
      const mockSuggestions = generateMockSuggestions(input, includedPrimaryTypes[0])
      return NextResponse.json({ 
        suggestions: mockSuggestions,
        fallback: true,
        error: `API Error: ${response.status} - ${errorText}`,
        debug: {
          requestBody,
          responseHeaders: Object.fromEntries(response.headers.entries())
        }
      })
    }

    const data = await response.json()
    console.log('Google Places API Response:', JSON.stringify(data, null, 2))

    // Transform Google Places API response to our format
    const suggestions = (data.suggestions || []).map((suggestion: any) => {
      const prediction = suggestion.placePrediction
      return {
        placeId: prediction.placeId,
        text: prediction.text?.text || '',
        mainText: prediction.structuredFormat?.mainText?.text || '',
        secondaryText: prediction.structuredFormat?.secondaryText?.text || '',
        fullText: prediction.text?.text || ''
      }
    })

    return NextResponse.json({ suggestions })

  } catch (error) {
    console.error('Places autocomplete error:', error)
    
    // Fallback to mock data on error
    const mockSuggestions = generateMockSuggestions(body?.input || '', body?.includedPrimaryTypes?.[0])
    return NextResponse.json({ 
      suggestions: mockSuggestions,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function parseGermanAddress(address: string) {
  // Erwartetes Format: "Straße Hausnummer, PLZ Ort, (Ortsteil)"
  let strasse = '', hausnummer = '', plz = '', ort = '', ortsteil = ''
  
  console.log('Parsing address:', address)
  
  const parts = address.split(',').map(p => p.trim())
  console.log('Address parts:', parts)
  
  if (parts.length >= 1) {
    const streetPart = parts[0]
    
    // Straße und Hausnummer aus erstem Teil extrahieren
    const streetMatch = streetPart.match(/^(.+?)\s+(\d+(?:[a-zA-Z]?|[-/]\d+[a-zA-Z]?)?)$/)
    if (streetMatch) {
      strasse = streetMatch[1].trim()
      hausnummer = streetMatch[2].trim()
    } else {
      strasse = streetPart
    }
  }
  
  if (parts.length >= 2) {
    const cityPart = parts[1]
    
    // PLZ und Ort aus zweitem Teil extrahieren - verschiedene Formate unterstützen
    const cityWithPLZMatch = cityPart.match(/^(\d{5})\s+(.+)$/)
    if (cityWithPLZMatch) {
      plz = cityWithPLZMatch[1]
      ort = cityWithPLZMatch[2]
    } else {
      // Kein PLZ gefunden, behandle als Ort oder Ortsteil
      // Prüfe, ob es eine deutsche Stadt ist (enthält keine Zahlen am Anfang)
      if (!/^\d/.test(cityPart)) {
        // Behandle als Ort/Ortsteil
        if (cityPart.includes('-')) {
          const cityParts = cityPart.split('-')
          ort = cityParts[0]
          ortsteil = cityParts.slice(1).join('-')
        } else {
          ort = cityPart
        }
      }
    }
  }
  
  // Ortsteil aus drittem Teil (falls vorhanden)
  if (parts.length >= 3) {
    ortsteil = parts[2]
  }
  
  // Spezielle Behandlung für bekannte deutsche Formate
  // Wie "Gebhardshagen" -> könnte ein Ortsteil sein, wenn kein Ort gesetzt ist
  if (!ort && ortsteil) {
    ort = ortsteil
    ortsteil = ''
  }
  
  console.log('Parsed result:', { strasse, hausnummer, plz, ort, ortsteil })
  return { strasse, hausnummer, plz, ort, ortsteil }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')
  if (!placeId) {
    return NextResponse.json({ error: 'placeId fehlt' }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=address_component,formatted_address&language=de&key=${GOOGLE_PLACES_API_KEY}`
  const response = await fetch(url)
  if (!response.ok) {
    return NextResponse.json({ error: 'Google Places Details API Fehler' }, { status: 500 })
  }
  const data = await response.json()
  // Extrahiere die wichtigsten Komponenten
  const components = data.result?.address_components || []
  let strasse = '', hausnummer = '', plz = '', ort = '', ortsteil = ''
  for (const comp of components) {
    if (comp.types.includes('route')) strasse = comp.long_name
    if (comp.types.includes('street_number')) hausnummer = comp.long_name
    if (comp.types.includes('postal_code')) plz = comp.long_name
    if (comp.types.includes('locality')) ort = comp.long_name
    if (comp.types.includes('sublocality') || comp.types.includes('sublocality_level_1')) ortsteil = comp.long_name
    if (comp.types.includes('administrative_area_level_2') && !ort) ort = comp.long_name
  }
  // Fallback: parse formatted_address falls etwas fehlt
  if (!strasse || !hausnummer || !plz || !ort) {
    const parsed = parseGermanAddress(data.result?.formatted_address || '')
    if (!strasse) strasse = parsed.strasse
    if (!hausnummer) hausnummer = parsed.hausnummer
    if (!plz) plz = parsed.plz
    if (!ort) ort = parsed.ort
    if (!ortsteil) ortsteil = parsed.ortsteil
  }
  return NextResponse.json({ strasse, hausnummer, plz, ort, ortsteil, formatted_address: data.result?.formatted_address })
}

// Fallback mock data function
function generateMockSuggestions(input: string, type?: string): any[] {
  const mockData = {
    hospital: [
      { text: 'Klinikum München, Marchioninistraße 15, 81377 München', mainText: 'Klinikum München', secondaryText: 'Marchioninistraße 15, 81377 München' },
      { text: 'Charité - Universitätsmedizin Berlin, Charitéplatz 1, 10117 Berlin', mainText: 'Charité - Universitätsmedizin Berlin', secondaryText: 'Charitéplatz 1, 10117 Berlin' },
      { text: 'Universitätsklinikum Hamburg-Eppendorf, Martinistraße 52, 20246 Hamburg', mainText: 'Universitätsklinikum Hamburg-Eppendorf', secondaryText: 'Martinistraße 52, 20246 Hamburg' }
    ],
    nursing_home: [
      { text: 'Seniorenresidenz München, Maximilianstraße 10, 80539 München', mainText: 'Seniorenresidenz München', secondaryText: 'Maximilianstraße 10, 80539 München' },
      { text: 'Pflegeheim Berlin-Mitte, Unter den Linden 20, 10117 Berlin', mainText: 'Pflegeheim Berlin-Mitte', secondaryText: 'Unter den Linden 20, 10117 Berlin' },
      { text: 'Augustinum Hamburg, August-Krogmann-Straße 100, 22159 Hamburg', mainText: 'Augustinum Hamburg', secondaryText: 'August-Krogmann-Straße 100, 22159 Hamburg' }
    ],
    establishment: [
      { text: 'Hospiz München, Menzinger Straße 34, 80638 München', mainText: 'Hospiz München', secondaryText: 'Menzinger Straße 34, 80638 München' },
      { text: 'Hospiz am Urban Berlin, Dieffenbachstraße 33, 10967 Berlin', mainText: 'Hospiz am Urban Berlin', secondaryText: 'Dieffenbachstraße 33, 10967 Berlin' },
      { text: 'Lighthouse Hospiz Hamburg, Berner Heerweg 173, 22159 Hamburg', mainText: 'Lighthouse Hospiz Hamburg', secondaryText: 'Berner Heerweg 173, 22159 Hamburg' }
    ],
    address: [
      { text: 'Maximilianstraße 1, 80539 München', mainText: 'Maximilianstraße 1', secondaryText: '80539 München' },
      { text: 'Unter den Linden 20, 10117 Berlin', mainText: 'Unter den Linden 20', secondaryText: '10117 Berlin' },
      { text: 'Mönckebergstraße 15, 20095 Hamburg', mainText: 'Mönckebergstraße 15', secondaryText: '20095 Hamburg' },
      { text: 'Königsallee 28, 40212 Düsseldorf', mainText: 'Königsallee 28', secondaryText: '40212 Düsseldorf' },
      { text: 'Hauptstraße 45, 69117 Heidelberg', mainText: 'Hauptstraße 45', secondaryText: '69117 Heidelberg' },
      { text: 'Marienplatz 8, 80331 München', mainText: 'Marienplatz 8', secondaryText: '80331 München' },
      { text: 'Friedrichstraße 123, 10117 Berlin', mainText: 'Friedrichstraße 123', secondaryText: '10117 Berlin' }
    ]
  }

  const data = mockData[type as keyof typeof mockData] || mockData.address
  return data
    .filter(item => item.text.toLowerCase().includes(input.toLowerCase()))
    .map(item => ({
      placeId: `mock-${Math.random()}`,
      text: item.text,
      mainText: item.mainText,
      secondaryText: item.secondaryText,
      fullText: item.text
    }))
} 