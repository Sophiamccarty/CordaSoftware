import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, LoginCredentials } from '@/lib/types';

export class AuthService {
  private static jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  
  // Test users für localhost
  private static testUsers = [
    { username: 'admin', password: 'CordaAdmin2024!', role: UserRole.ADMIN, company: 'Test Firma' },
    { username: 'geschaeftsfuehrung', password: 'Geschaeftsfuehrung123!', role: UserRole.GESCHAEFTSFUEHRUNG, company: 'Test Firma' },
    { username: 'manager', password: 'Manager123!', role: UserRole.MANAGER, company: 'Test Firma' },
    { username: 'mitarbeiter', password: 'Mitarbeiter123!', role: UserRole.MITARBEITER, company: 'Test Firma' },
    { username: 'aushilfe', password: 'Aushilfe123!', role: UserRole.AUSHILFE, company: 'Test Firma' },
  ];

  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    // Localhost Test Mode
    if (process.env.NODE_ENV === 'development' && process.env.IS_LOCALHOST === 'true') {
      return this.handleTestLogin(credentials);
    }

    // Admin Login
    if (credentials.username === 'CordaAdmin') {
      return this.handleAdminLogin(credentials);
    }

    // Regular User Login - not implemented yet
    console.log('Database login not implemented yet');
    return null;
  }

  private static async handleTestLogin(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    const testUser = this.testUsers.find(u => u.username === credentials.username);
    
    if (!testUser) {
      return null;
    }

    // Validate password
    if (credentials.password !== testUser.password) {
      return null;
    }

    const user: User = {
      id: `test-${testUser.username}`,
      username: testUser.username,
      email: `${testUser.username}@test.com`,
      role: testUser.role,
      isActive: true,
      companyId: 'test-company',
      company: {
        id: 'test-company',
        name: testUser.company,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    };

    const token = this.generateToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    return { user, token };
  }

  private static async handleAdminLogin(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    const adminPassword = process.env.CORDA_ADMIN_PASSWORD;
    
    if (!adminPassword || credentials.password !== adminPassword) {
      return null;
    }

    const user: User = {
      id: 'corda-admin',
      username: 'CordaAdmin',
      email: 'admin@corda.de',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    };

    const token = this.generateToken({
      userId: user.id,
      role: user.role,
      isAdmin: true,
    });

    return { user, token };
  }

  static generateToken(payload: { userId: string; role: UserRole; companyId?: string; isAdmin?: boolean }): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.ADMIN]: 5,
      [UserRole.GESCHAEFTSFUEHRUNG]: 4,
      [UserRole.MANAGER]: 3,
      [UserRole.MITARBEITER]: 2,
      [UserRole.AUSHILFE]: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  static canAccessCompanyData(userRole: UserRole, userCompanyId?: string, targetCompanyId?: string): boolean {
    // Admin can access all company data
    if (userRole === UserRole.ADMIN) {
      return true;
    }

    // Users can only access their own company data
    return userCompanyId === targetCompanyId;
  }
}

export function requireAuth(requiredRole?: UserRole) {
  return async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Nicht autorisiert' });
      }

      const decoded = AuthService.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Ungültiger Token' });
      }

      if (requiredRole && !AuthService.hasPermission(decoded.role, requiredRole)) {
        return res.status(403).json({ error: 'Unzureichende Berechtigung' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Serverfehler' });
    }
  };
} 