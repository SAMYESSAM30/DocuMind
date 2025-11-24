import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';
import { BRDRequirements } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        documentName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { documentName, documentText, requirements } = await request.json();

    if (!documentName || !documentText || !requirements) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        documentName,
        documentText,
        requirements: JSON.stringify(requirements),
      },
    });

    // Increment AI calls used
    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiCallsUsed: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        documentName: analysis.documentName,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

