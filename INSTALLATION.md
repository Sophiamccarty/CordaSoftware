# 🚀 CORDA - Installationsanleitung

## Node.js Installation (erforderlich)

**CORDA benötigt Node.js 18 oder höher um zu funktionieren.**

### macOS Installation

#### Option 1: Homebrew (empfohlen)
```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js installieren
brew install node

# Version überprüfen
node --version
npm --version
```

#### Option 2: Offizieller Download
1. Gehe zu [nodejs.org](https://nodejs.org)
2. Lade die **LTS Version** für macOS herunter
3. Installiere die .pkg Datei
4. Terminal neustarten

#### Option 3: NVM (Node Version Manager)
```bash
# NVM installieren
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Terminal neustarten oder:
source ~/.bashrc

# Neueste LTS Version installieren
nvm install --lts
nvm use --lts
```

## CORDA Setup nach Node.js Installation

### 1. Dependencies installieren
```bash
cd "CORDA - BESTATTERSOFTWARE"
npm install
```

### 2. Environment Variables erstellen
```bash
cp env.example .env
```

Bearbeite die `.env` Datei:
```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CORDA

# Database
DATABASE_URL="file:./var/data/corda/database.db"

# Authentication
JWT_SECRET=corda-super-secret-jwt-key-development-only
NEXTAUTH_SECRET=corda-nextauth-secret-development

# Admin Configuration
CORDA_ADMIN_PASSWORD=admin123

# Development specific
NODE_ENV=development
IS_LOCALHOST=true
```

### 3. Datenbank einrichten
```bash
# Prisma Client generieren
npx prisma generate

# Datenbank Schema anwenden
npx prisma db push

# Testdaten einfügen
npm run db:seed
```

### 4. Development Server starten
```bash
npm run dev
```

**🎉 CORDA läuft jetzt auf:** `http://localhost:3000`

## Test-Anmeldedaten

### Admin
- **Benutzername:** `admin`
- **Passwort:** `admin123`

### Test-Benutzer
- **Benutzername:** `geschaeftsfuehrer`, `manager`, `mitarbeiter`, `aushilfe`
- **Passwort:** `test`

## Häufige Probleme

### "command not found: npm"
**Lösung:** Node.js ist nicht installiert oder nicht im PATH
- Node.js installieren (siehe oben)
- Terminal neustarten

### "Cannot find module '@prisma/client'"
**Lösung:** Dependencies nicht installiert
```bash
npm install
npx prisma generate
```

### "Database does not exist"
**Lösung:** Datenbank noch nicht erstellt
```bash
npx prisma db push
npm run db:seed
```

### Port 3000 bereits belegt
**Lösung:** Anderen Port verwenden
```bash
npm run dev -- --port 3001
```

## Nächste Schritte

1. **Login testen** - Besuche `http://localhost:3000`
2. **Dashboard erkunden** - Melde dich mit Test-Daten an
3. **KI-Features** - Füge OpenAI API Key hinzu (optional)
4. **Deployment** - Siehe README.md für Render.com Setup

## Support

Bei Problemen:
1. Node.js Version prüfen: `node --version` (sollte ≥18.0.0 sein)
2. Dependencies neu installieren: `rm -rf node_modules && npm install`
3. Datenbank zurücksetzen: `rm -rf var/data && npx prisma db push && npm run db:seed`

**Viel Erfolg mit CORDA! 🚀** 