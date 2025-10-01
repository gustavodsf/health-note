
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            return null;
          }

          // Log the login audit
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              entityType: 'User',
              entityId: user.id,
              metadata: {
                timestamp: new Date(),
                method: 'credentials'
              }
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            role: user.role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login'
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: token.sub,
              action: 'LOGOUT',
              entityType: 'User',
              entityId: token.sub,
              metadata: {
                timestamp: new Date()
              }
            }
          });
        } catch (error) {
          console.error('Logout audit error:', error);
        }
      }
    }
  }
};
