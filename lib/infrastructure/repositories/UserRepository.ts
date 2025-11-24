/**
 * Repository Implementation - Repository Pattern
 * Concrete implementation of IUserRepository using Prisma
 */
import { prisma } from '@/lib/db';
import { IUserRepository, CreateUserData } from '@/lib/domain/interfaces/IUserRepository';
import { User } from '@/lib/domain/entities/User';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user as User | null;
  }

  async create(userData: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        // @ts-expect-error - password is optional in schema (String?) but Prisma types may not reflect this until client is regenerated
        password: userData.password ?? null,
        name: userData.name ?? null,
        plan: (userData.plan || 'FREE') as 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE',
        aiCallsLimit: userData.aiCallsLimit || 5,
      },
    });
    return user as User;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updateData: any = { ...userData };
    if (updateData.plan && typeof updateData.plan === 'string') {
      updateData.plan = updateData.plan as 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
    }
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return user as User;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

