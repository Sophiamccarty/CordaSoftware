# 🏆 CORDA - Die revolutionäre Bestattungssoftware

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

## 📋 Projektbeschreibung

**CORDA** ist eine moderne, webbasierte Bestattungssoftware, die speziell für Bestattungsunternehmen entwickelt wurde. Sie bietet eine intuitive Benutzeroberfläche und umfassende Funktionen für die Verwaltung von Sterbefällen, Kunden und Bestattungsdienstleistungen.

## ✨ Features

### 🎯 Kernfunktionen
- **Sterbefall-Management**: Vollständige Erfassung und Verwaltung von Sterbefällen
- **Personen-Verwaltung**: Verstorbene, Auftraggeber, Angehörige und Ehepartner
- **Posten-System**: Flexibles Abrechnungssystem mit verschiedenen Kategorien
- **Listen-Management**: System- und benutzerdefinierte Postenlisten
- **Bestattungsplanung**: Koordination von Terminen und Dienstleistungen

### 🎨 Benutzeroberfläche
- **Modern Design**: Dunkles Theme mit Gold-Akzenten (CORDA-Gold)
- **Responsive**: Optimiert für Desktop, Tablet und Mobile
- **Animationen**: Smooth Framer Motion Animationen
- **Drag & Drop**: Intuitive Sortierung von Posten
- **Auto-Vervollständigung**: Intelligente Adress- und Ortssuche

### 🔧 Technische Features
- **TypeScript**: Typsichere Entwicklung
- **Real-time**: Live-Updates der Daten
- **Auto-Save**: Automatisches Speichern alle 30 Sekunden
- **Modular**: Komponentenbasierte Architektur
- **Suchfunktion**: Umfassende Filter- und Suchoptionen

## 🚀 Installation

### Voraussetzungen
- Node.js 18.0 oder höher
- npm oder yarn
- Git

### Setup
1. **Repository klonen**
   ```bash
   git clone https://github.com/Sophiamccarty/CordaSoftware.git
   cd CordaSoftware
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env.local
   # Bearbeite .env.local mit deinen Einstellungen
   ```

4. **Datenbank setup** (falls Prisma verwendet wird)
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Development Server starten**
   ```bash
   npm run dev
   ```

6. **Öffne** http://localhost:3000 im Browser

## 📁 Projektstruktur

```
CORDA-BESTATTERSOFTWARE/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard Seiten
│   │   └── sterbefaelle/  # Sterbefall-Management
│   ├── components/        # Wiederverwendbare Komponenten
│   └── api/              # API Routes
├── components/            # Globale Komponenten
├── lib/                  # Utility-Funktionen
├── prisma/              # Datenbank Schema (falls verwendet)
├── public/              # Statische Assets
└── styles/              # Globale Styles
```

## 🎨 Design System

### Farben
- **Primary**: CORDA-Gold (#D4AF37)
- **Background**: Dunkle Grautöne
- **Text**: Weiß/Hellgrau
- **Akzente**: Gold für CTAs und wichtige Elemente

### Komponenten
- **Buttons**: Verschiedene Varianten (Primary, Secondary, Ghost)
- **Inputs**: Konsistente Formular-Elemente
- **Modals**: Overlay-Dialoge für Workflows
- **Cards**: Strukturierte Inhalts-Container

## 🛠 Entwicklung

### Verfügbare Scripts
- `npm run dev` - Development Server
- `npm run build` - Production Build
- `npm run start` - Production Server
- `npm run lint` - Code Linting
- `npm run type-check` - TypeScript Checks

### Code Style
- **TypeScript**: Strict Mode aktiviert
- **ESLint**: Code Quality Rules
- **Prettier**: Code Formatting
- **Husky**: Pre-commit Hooks (optional)

## 📝 API Dokumentation

### Sterbefälle
- `GET /api/sterbefaelle` - Alle Sterbefälle abrufen
- `POST /api/sterbefaelle` - Neuen Sterbefall erstellen
- `PUT /api/sterbefaelle/[id]` - Sterbefall bearbeiten
- `DELETE /api/sterbefalle/[id]` - Sterbefall löschen

### Posten
- `GET /api/posten` - Verfügbare Posten
- `POST /api/posten` - Neuen Posten erstellen

## 💾 Datenbank & Storage

### 🗄️ **Eigenes Datenbank-System**
CORDA verwendet ein eigenes, dateibasiertes Datenbank-System, das speziell für Render.com optimiert ist:

```
/var/data/corda/                    # Hauptdatenbank-Verzeichnis
├── database.db                     # SQLite Hauptdatenbank (optional)
├── sterbefaelle/                   # Sterbefall-Daten
│   ├── 2024/                      # Jahr-basierte Struktur
│   │   ├── 01/                    # Monats-Ordner
│   │   └── 02/
│   └── aktiv/                     # Aktive Fälle
├── vorlagen/                       # Posten-Vorlagen
│   ├── system/                    # System-Vorlagen
│   └── benutzer/                  # Benutzer-Vorlagen
├── listen/                         # Gespeicherte Listen
├── backups/                       # Automatische Backups
│   ├── daily/                     # Tägliche Backups
│   └── weekly/                    # Wöchentliche Backups
├── uploads/                       # Datei-Uploads
│   ├── dokumente/                 # PDF-Dokumente
│   └── bilder/                    # Bilder & Fotos
└── logs/                          # System-Logs
    ├── access.log                 # Zugriffs-Logs
    └── error.log                  # Fehler-Logs
```

### ☁️ **Render.com Integration**
- **Persistent Disk**: Montiert unter `/var/data`
- **Automatische Backups**: Tägliche Sicherung der kritischen Daten
- **Skalierbar**: Speicher kann bei Bedarf erweitert werden
- **Hochverfügbar**: Render.com garantiert 99.9% Uptime

### 🔄 **Daten-Management**
- **JSON-basiert**: Flexibles Schema für schnelle Entwicklung
- **SQLite Integration**: Für komplexe Abfragen und Reporting
- **Automatische Migration**: Seamless Updates zwischen Versionen
- **Crash-Recovery**: Automatische Wiederherstellung bei Systemfehlern

## 🔒 Sicherheit

- **Input Validation**: Zod-basierte Eingabevalidierung
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: Next.js built-in Schutz
- **CSRF Protection**: Implementiert über Next.js
- **Daten-Verschlüsselung**: Sensible Daten werden verschlüsselt gespeichert
- **Backup-Verschlüsselung**: Alle Backups sind AES-256 verschlüsselt

## 🧪 Testing

```bash
# Unit Tests (falls implementiert)
npm run test

# E2E Tests (falls implementiert)
npm run test:e2e
```

## 📦 Deployment

### Render.com (Primär - mit Disk Storage)
1. **Web Service erstellen**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

2. **Disk Storage hinzufügen**
   - Mount Path: `/var/data`
   - Mindestens 2GB Speicher
   - Automatische Backups aktivieren

3. **Umgebungsvariablen setzen**
   ```env
   NODE_ENV=production
   DATABASE_URL=file:/var/data/corda/database.db
   CORDA_DATA_PATH=/var/data/corda
   NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
   ```

### Vercel (Alternative - ohne persistente Daten)
1. Repository mit Vercel verbinden
2. Umgebungsvariablen setzen
3. Automatisches Deployment bei Push
⚠️ **Hinweis**: Ohne persistente Datenbank

### Andere Plattformen
- **Docker**: Dockerfile enthalten
- **VPS**: PM2 oder ähnlich mit persistentem Storage
- **Cloud**: AWS, Google Cloud, Azure mit Volume Mounting

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📋 Roadmap

### Version 1.0 (Alpha) ✅
- [x] Grundlegende Sterbefall-Erfassung
- [x] Posten-Management
- [x] Listen-System
- [x] Responsive Design

### Version 1.1 (Beta)
- [ ] Benutzer-Authentifizierung
- [ ] Rollen-Management
- [ ] Backup-System
- [ ] Export-Funktionen

### Version 2.0
- [ ] Multi-Tenant Support
- [ ] Erweiterte Statistiken
- [ ] Mobile App
- [ ] API für Drittsysteme

## 📞 Support

- **Email**: info@sophiamccarty.com
- **GitHub Issues**: [Issues](https://github.com/Sophiamccarty/CordaSoftware/issues)
- **Dokumentation**: [Wiki](https://github.com/Sophiamccarty/CordaSoftware/wiki)

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz veröffentlicht. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- **Next.js Team** für das fantastische Framework
- **Tailwind CSS** für das Styling-System
- **Framer Motion** für die Animationen
- **Vercel** für das Hosting

---

**Entwickelt mit ❤️ für die Bestattungsbranche** 