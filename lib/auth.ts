import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
import { User, UserRole, LoginCredentials } from '@/lib/types';

// const prisma = new PrismaClient();
let prisma: any = null;

// Initialize Prisma only when needed
const getPrisma = async () => {
  if (!prisma) {
    try {
      const prismaModule = await import('@prisma/client');
      const PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;
      if (PrismaClient) {
        prisma = new PrismaClient();
      } else {
        return null;
      }
    } catch (error) {
      console.warn('Prisma not available, running in test mode only');
      return null;
    }
  }
  return prisma;
};

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

    // Regular User Login
    return this.handleUserLogin(credentials);
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

  private static async handleUserLogin(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    // For now, skip database login in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Database login skipped in development mode');
      return null;
    }

    try {
      // Dynamic import for production
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      const dbUser = await prisma.user.findUnique({
        where: { username: credentials.username },
        include: { company: true },
      });

      if (!dbUser || !dbUser.isActive) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      // await prisma.user.update({
      //   where: { id: dbUser.id },
      //   data: { lastLogin: new Date() },
      // });

      const user: User = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email || '',
        role: dbUser.role as UserRole,
        isActive: dbUser.isActive,
        companyId: dbUser.companyId ?? undefined,
        company: dbUser.company ? {
          ...dbUser.company,
          website: dbUser.company.website || undefined,
        } : undefined,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        lastLogin: new Date(),
      };

      const token = this.generateToken({
        userId: user.id,
        role: user.role,
        companyId: user.companyId,
      });

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
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

  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    companyId: string;
  }): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        companyId: userData.companyId,
      },
      include: { company: true },
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as UserRole,
      isActive: user.isActive,
      companyId: user.companyId || undefined,
      company: user.company || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async createCompany(companyData: {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    website?: string;
  }) {
    return prisma.company.create({
      data: companyData,
    });
  }

  // Role-based permissions
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
    // Admin kann alles
    if (userRole === UserRole.ADMIN) {
      return true;
    }

    // Andere können nur ihre eigene Firma sehen
    return userCompanyId === targetCompanyId;
  }
}

// Middleware für API-Routen
export function requireAuth(requiredRole?: UserRole) {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const decoded = AuthService.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check role permission if required
      if (requiredRole && !AuthService.hasPermission(decoded.role, requiredRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
} 