/**
 * Repository Implementation - Repository Pattern
 * Concrete implementation of ISessionRepository using Prisma
 */
import { prisma } from '@/lib/db';
import { ISessionRepository, CreateSessionData } from '@/lib/domain/interfaces/ISessionRepository';
import { Session } from '@/lib/domain/entities/Session';

export class SessionRepository implements ISessionRepository {
  async create(sessionData: CreateSessionData): Promise<Session> {
    const session = await prisma.session.create({
      data: {
        userId: sessionData.userId,
        token: sessionData.token,
        expiresAt: sessionData.expiresAt,
      },
      include: { user: true },
    });
    return session as Session;
  }

  async findByToken(token: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    return session as Session | null;
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }
}

