#!/bin/bash

echo "🚀 Starting CORDA - Die revolutionäre Bestattungssoftware"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo "   Bitte installieren Sie Node.js von https://nodejs.org"
    exit 1
fi

echo "📦 Node.js Version: $(node --version)"
echo "📦 NPM Version: $(npm --version)"
echo ""

# Set environment variables
export DATABASE_URL="file:./var/data/corda/database.db"
export CORDA_DATA_PATH="./var/data/corda"
export JWT_SECRET="corda-super-secret-jwt-key-2024"
export ADMIN_PASSWORD="CordaAdmin2024!"
export CORDA_ADMIN_PASSWORD="CordaAdmin2024!"
export NODE_ENV="development"
export IS_LOCALHOST="true"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"

echo "🔧 Environment configured:"
echo "   DATABASE_URL: $DATABASE_URL"
echo "   NODE_ENV: $NODE_ENV"
echo "   APP_URL: $NEXT_PUBLIC_APP_URL"
echo ""

echo "🔑 Login Credentials:"
echo "   Admin: admin / CordaAdmin2024!"
echo "   Geschäftsführung: geschaeftsfuehrung / Geschaeftsfuehrung123!"
echo "   Manager: manager / Manager123!"
echo "   Mitarbeiter: mitarbeiter / Mitarbeiter123!"
echo "   Aushilfe: aushilfe / Aushilfe123!"
echo ""

echo "🌐 Starting development server..."
echo "   Server will be available at: http://localhost:3000"
echo ""

# Start the development server
npm run dev 