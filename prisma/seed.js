const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Erstelle Test-Firma
  const testCompany = await prisma.company.upsert({
    where: { id: 'test-company' },
    update: {},
    create: {
      id: 'test-company',
      name: 'Bestattungsinstitut Mustermann',
      address: 'Musterstraße 123',
      city: 'Musterstadt',
      postalCode: '12345',
      phone: '+49 123 456789',
      email: 'info@mustermann-bestattungen.de',
      website: 'https://mustermann-bestattungen.de',
      settings: JSON.stringify({
        theme: 'dark',
        notifications: true,
        autoBackup: true
      })
    }
  })
  
  // Erstelle Benutzer
  const users = [
    {
      id: 'user-admin',
      username: 'admin',
      email: 'admin@corda.de',
      firstName: 'System',
      lastName: 'Administrator',
      password: await bcrypt.hash('CordaAdmin2024!', 12),
      role: 'ADMIN',
      companyId: testCompany.id
    },
    {
      id: 'user-gf',
      username: 'geschaeftsfuehrung',
      email: 'gf@mustermann-bestattungen.de',
      firstName: 'Max',
      lastName: 'Mustermann',
      password: await bcrypt.hash('Geschaeftsfuehrung123!', 12),
      role: 'GESCHAEFTSFUEHRUNG',
      companyId: testCompany.id
    },
    {
      id: 'user-manager',
      username: 'manager',
      email: 'manager@mustermann-bestattungen.de',
      firstName: 'Maria',
      lastName: 'Musterfrau',
      password: await bcrypt.hash('Manager123!', 12),
      role: 'MANAGER',
      companyId: testCompany.id
    },
    {
      id: 'user-mitarbeiter',
      username: 'mitarbeiter',
      email: 'mitarbeiter@mustermann-bestattungen.de',
      firstName: 'Hans',
      lastName: 'Müller',
      password: await bcrypt.hash('Mitarbeiter123!', 12),
      role: 'MITARBEITER',
      companyId: testCompany.id
    },
    {
      id: 'user-aushilfe',
      username: 'aushilfe',
      email: 'aushilfe@mustermann-bestattungen.de',
      firstName: 'Anna',
      lastName: 'Schmidt',
      password: await bcrypt.hash('Aushilfe123!', 12),
      role: 'AUSHILFE',
      companyId: testCompany.id
    }
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: userData
    })
  }
  
  // Erstelle Test-Sterbefall
  const testSterbefall = await prisma.sterbefall.upsert({
    where: { id: 'test-sterbefall-1' },
    update: {},
    create: {
      id: 'test-sterbefall-1',
      fallNummer: 'SF-2024-001',
      verstorbener: JSON.stringify({
        vorname: 'Wilhelm',
        nachname: 'Beispiel',
        geburtsdatum: '1945-03-15',
        sterbedatum: '2024-01-15',
        sterbeort: 'Musterstadt',
        staatsangehoerigkeit: 'deutsch',
        familienstand: 'verheiratet',
        beruf: 'Rentner',
        religion: 'evangelisch'
      }),
      angehoerige: JSON.stringify([
        {
          vorname: 'Margarete',
          nachname: 'Beispiel',
          verwandtschaftsgrad: 'Ehefrau',
          telefon: '+49 123 456789',
          email: 'margarete.beispiel@email.de',
          adresse: 'Musterstraße 123, 12345 Musterstadt'
        }
      ]),
      bestattungsart: 'ERDBESTATTUNG',
      bestattungsort: 'Friedhof Musterstadt',
      friedhof: 'Hauptfriedhof Musterstadt',
      status: 'ERFASSUNG',
      prioritaet: 'NORMAL',
      kostenvoranschlag: 3500.00,
      companyId: testCompany.id
    }
  })
  
  // Erstelle Test-Vorsorge
  const testVorsorge = await prisma.vorsorge.upsert({
    where: { id: 'test-vorsorge-1' },
    update: {},
    create: {
      id: 'test-vorsorge-1',
      vorsorgNummer: 'VS-2024-001',
      person: JSON.stringify({
        vorname: 'Gertrud',
        nachname: 'Vorsorge',
        geburtsdatum: '1950-08-20',
        telefon: '+49 123 987654',
        email: 'gertrud.vorsorge@email.de',
        adresse: 'Vorsorgestraße 456, 12345 Musterstadt'
      }),
      bestattungsart: 'FEUERBESTATTUNG',
      friedhofswunsch: 'Waldfriedhof Musterstadt',
      besondereWuensche: JSON.stringify({
        musik: 'Ave Maria',
        blumen: 'Weiße Rosen',
        sonstiges: 'Keine Trauerreden'
      }),
      status: 'BERATUNG',
      betrag: 2800.00,
      companyId: testCompany.id
    }
  })
  
  // Erstelle Test-Aktivitäten
  const activities = [
    {
      type: 'STERBEFALL_ERSTELLT',
      title: 'Sterbefall erfasst',
      description: 'Neuer Sterbefall Wilhelm Beispiel wurde erfasst',
      companyId: testCompany.id,
      sterbefallId: testSterbefall.id
    },
    {
      type: 'VORSORGE_ERSTELLT',
      title: 'Vorsorgevertrag erstellt',
      description: 'Neuer Vorsorgevertrag für Gertrud Vorsorge wurde erstellt',
      companyId: testCompany.id,
      vorsorgeId: testVorsorge.id
    },
    {
      type: 'LOGIN',
      title: 'Benutzer angemeldet',
      description: 'Administrator hat sich angemeldet',
      companyId: testCompany.id
    }
  ]
  
  for (const activityData of activities) {
    await prisma.activity.create({
      data: activityData
    })
  }
  
  console.log('✅ Seeding completed successfully!')
  console.log('📊 Created:')
  console.log('   - 1 Company (Bestattungsinstitut Mustermann)')
  console.log('   - 5 Users (Admin, Geschäftsführung, Manager, Mitarbeiter, Aushilfe)')
  console.log('   - 1 Sterbefall (Wilhelm Beispiel)')
  console.log('   - 1 Vorsorge (Gertrud Vorsorge)')
  console.log('   - 3 Activities')
  console.log('')
  console.log('🔑 Login Credentials:')
  console.log('   Admin: admin / CordaAdmin2024!')
  console.log('   Geschäftsführung: geschaeftsfuehrung / Geschaeftsfuehrung123!')
  console.log('   Manager: manager / Manager123!')
  console.log('   Mitarbeiter: mitarbeiter / Mitarbeiter123!')
  console.log('   Aushilfe: aushilfe / Aushilfe123!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 