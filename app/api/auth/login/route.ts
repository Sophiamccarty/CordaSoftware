import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-simple'
import { LoginCredentials } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const credentials: LoginCredentials = {
      username: body.username,
      password: body.password,
      companyId: body.companyId,
    }

    // Validate input
    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        { success: false, error: 'Benutzername und Passwort sind erforderlich' },
        { status: 400 }
      )
    }

    // Attempt login
    const result = await AuthService.login(credentials)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      )
    }

    const { user, token } = result

    // Log successful login
    console.log(`Successful login: ${user.username} (${user.role})`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: user.company,
      },
      token,
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
} 