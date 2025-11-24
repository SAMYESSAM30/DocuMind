/**
 * OAuth User Service - Service Layer Pattern
 * Handles user creation and account linking for OAuth
 */
import { prisma } from '@/lib/db';
import { OAuthProvider, OAuthUserInfo, OAuthCallbackResult } from '@/lib/domain/interfaces/IOAuthStrategy';
import { User } from '@/lib/domain/entities/User';
import { SessionTokenGenerator } from '../security/SessionTokenGenerator';
import { SessionRepository } from '../repositories/SessionRepository';

export class OAuthUserService {
  private sessionTokenGenerator: SessionTokenGenerator;
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionTokenGenerator = new SessionTokenGenerator();
    this.sessionRepository = new SessionRepository();
  }

  async findOrCreateUser(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<OAuthCallbackResult> {
    if (!userInfo.email) {
      throw new Error('Email is required but not provided by OAuth provider');
    }

    // Find existing account
    // @ts-ignore - Account model will be available after Prisma client generation
    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: userInfo.id,
        },
      },
      include: { user: true },
    });

    let user: User;

    if (account) {
      // Update existing account tokens
      user = account.user as User;
      // @ts-ignore - Account model will be available after Prisma client generation
      await prisma.account.update({
        where: { id: account.id },
        data: {
          accessToken,
          refreshToken: refreshToken || null,
          expiresAt: expiresIn
            ? new Date(Date.now() + expiresIn * 1000)
            : null,
        },
      });
    } else {
      // Check if user exists with this email
      const existingUser = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!existingUser) {
        // Create new user
        user = (await prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            // @ts-expect-error - password is optional in schema (String?) but Prisma types may not reflect this until client is regenerated
            password: null,
            plan: 'FREE',
            aiCallsLimit: 5,
          },
        })) as User;
      } else {
        user = existingUser as User;
      }

      // Create account
      // @ts-ignore - Account model will be available after Prisma client generation
      await prisma.account.create({
        data: {
          userId: user.id,
          provider,
          providerAccountId: userInfo.id,
          accessToken,
          refreshToken: refreshToken || null,
          expiresAt: expiresIn
            ? new Date(Date.now() + expiresIn * 1000)
            : null,
        },
      });
    }

    // Create session using repository pattern
    const token = this.sessionTokenGenerator.generate();
    const expiresAt = this.sessionTokenGenerator.getExpirationDate();
    await this.sessionRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    return { user, token };
  }
}

