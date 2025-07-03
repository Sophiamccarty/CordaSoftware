# Friedhofssuche mit Google Places API

## Übersicht

Die Friedhofssuche-Funktionalität ermöglicht es Benutzern, Friedhöfe über die Google Places API zu suchen und auszuwählen. Diese Funktionalität ist in den Bestattungsformularen integriert.

## Funktionen

### 🔍 Intelligente Suche
- **Echtzeitsuche**: Suche nach Friedhöfen während der Eingabe
- **Debounced Search**: Optimierte API-Aufrufe (300ms Verzögerung)
- **Keyboard Navigation**: Pfeiltasten, Enter und Escape unterstützt
- **Auto-Complete**: Dropdown mit Friedhofsvorschlägen

### 📍 Strukturierte Daten
- **Name**: Offizieller Name des Friedhofs
- **Adresse**: Vollständige Adresse des Friedhofs
- **Place ID**: Google Place ID für weitere API-Abfragen
- **Koordinaten**: Geokoordinaten für Kartendarstellung
- **Bewertungen**: Google-Bewertungen (falls verfügbar)

### 🎨 Benutzerfreundliche Oberfläche
- **Loading Indicator**: Visuelle Rückmeldung während der Suche
- **Hover Effects**: Moderne Hover-Animation
- **Focus States**: Klare Fokussierung für Barrierefreiheit
- **Responsive Design**: Funktioniert auf allen Bildschirmgrößen

## Installation und Konfiguration

### 1. Abhängigkeiten
Die notwendigen Abhängigkeiten sind bereits installiert:
```bash
npm install @googlemaps/google-maps-services-js
```

### 2. Umgebungsvariablen
Fügen Sie Ihren Google Maps API-Schlüssel zur `.env.local` Datei hinzu:
```bash
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### 3. Google Cloud Console Setup
1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus
3. Aktivieren Sie die folgenden APIs:
   - Places API
   - Maps JavaScript API (optional für Kartendarstellung)
4. Erstellen Sie einen API-Schlüssel unter "Anmeldedaten"
5. Beschränken Sie den API-Schlüssel auf Ihre Domain (empfohlen)

## API-Endpunkt

### `/api/friedhof-suche`

**GET** - Suche nach Friedhöfen

**Parameter:**
- `query` (required): Suchbegriff für Friedhöfe
- `location` (optional): Geo-Location für lokalisierte Ergebnisse

**Antwort:**
```json
{
  "places": [
    {
      "place_id": "ChIJ...",
      "name": "Hauptfriedhof München",
      "formatted_address": "Friedhofstraße 1, 80337 München",
      "geometry": {
        "location": {
          "lat": 48.1351,
          "lng": 11.5820
        }
      },
      "rating": 4.2,
      "types": ["cemetery", "establishment", "point_of_interest"],
      "photos": [...]
    }
  ]
}
```

## Verwendung

### In React-Komponenten

```tsx
import { FriedhofAutocompleteField } from './components/FriedhofAutocompleteField'

function BestattungForm() {
  const [friedhof, setFriedhof] = useState('')
  const [friedhofData, setFriedhofData] = useState(null)

  return (
    <FriedhofAutocompleteField
      label="Friedhof auswählen"
      value={friedhof}
      onChange={(value, addressData) => {
        setFriedhof(value)
        setFriedhofData(addressData)
      }}
      bestattungsart="Erdbestattung"
      placeholder="Friedhof suchen..."
    />
  )
}
```

### Gespeicherte Daten

Die Komponente speichert die folgenden Daten in der `BestattungData`:
- `friedhofMeer`: Name des Friedhofs
- `friedhofMeerAdresse`: Vollständige Adresse
- `friedhofMeerPlaceId`: Google Place ID
- `friedhofMeerGeometry`: Geokoordinaten

## Suchlogik

### Suchstrategie
1. **Text Search**: Primäre Suche mit `${query} friedhof cemetery`
2. **Typ-Filter**: Filtert nach `cemetery` Typ (wo möglich)
3. **Lokalisierung**: Berücksichtigt Standort wenn verfügbar
4. **Ergebnis-Limit**: Maximal 10 Ergebnisse pro Suche

### Optimierungen
- **Caching**: Vermeidet doppelte API-Aufrufe
- **Error Handling**: Graceful Fallbacks bei API-Fehlern
- **Rate Limiting**: Debounced Suche verhindert zu viele Requests

## Sicherheit

### API-Schlüssel Schutz
- Server-seitige API-Aufrufe verhindern Client-Exposition
- Umgebungsvariablen für sensible Daten
- Domain-Beschränkungen in Google Console

### Input-Validierung
- Minimale Suchlänge (2 Zeichen)
- URL-Encoding für alle Parameter
- TypeScript für Typsicherheit

## Fehlerbehebung

### Häufige Probleme

1. **Keine Suchergebnisse**
   - Prüfen Sie den API-Schlüssel
   - Verifizieren Sie die aktivierten APIs
   - Testen Sie mit verschiedenen Suchbegriffen

2. **API-Fehler**
   - Überprüfen Sie die Quota-Limits
   - Validieren Sie die Domain-Einstellungen
   - Prüfen Sie die Netzwerkverbindung

3. **Langsame Suche**
   - Optimieren Sie die Debounce-Zeit
   - Implementieren Sie lokales Caching
   - Reduzieren Sie die Ergebnis-Anzahl

### Debug-Logs
API-Fehler werden in der Browser-Konsole und Server-Logs angezeigt:
```javascript
console.error('Fehler bei der Friedhof-Suche:', error)
```

## Weiterentwicklung

### Geplante Features
- **Kartenintegration**: Friedhof-Standorte auf Karte anzeigen
- **Favoriten**: Häufig verwendete Friedhöfe speichern
- **Erweiterte Filter**: Nach Bestattungsart, Region, etc.
- **Offline-Modus**: Lokale Friedhofsdatenbank für Offline-Nutzung

### Performance-Optimierungen
- **Service Worker**: Caching von API-Responses
- **Virtual Scrolling**: Für große Ergebnislisten
- **Prefetching**: Vorladen häufig genutzter Friedhöfe

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Dokumentation
2. Überprüfen Sie die Browser-Konsole
3. Validieren Sie die API-Konfiguration
4. Kontaktieren Sie das Entwicklungsteam 