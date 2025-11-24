import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (analysis.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if share link already exists
    const existingShareLink = await prisma.shareLink.findUnique({
      where: { analysisId: params.id },
    });

    if (existingShareLink) {
      return NextResponse.json({
        shareToken: existingShareLink.token,
        isPublic: existingShareLink.isPublic,
      });
    }

    // Generate unique token
    const shareToken = crypto.randomBytes(32).toString('hex');

    const shareLink = await prisma.shareLink.create({
      data: {
        analysisId: params.id,
        token: shareToken,
        isPublic: false,
      },
    });

    return NextResponse.json({
      shareToken: shareLink.token,
      isPublic: shareLink.isPublic,
    });
  } catch (error) {
    console.error('Create share link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
    });

    if (!analysis || analysis.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const shareLink = await prisma.shareLink.findUnique({
      where: { analysisId: params.id },
    });

    if (!shareLink) {
      return NextResponse.json({
        shareToken: null,
        isPublic: false,
      });
    }

    return NextResponse.json({
      shareToken: shareLink.token,
      isPublic: shareLink.isPublic,
    });
  } catch (error) {
    console.error('Get share link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
    });

    if (!analysis || analysis.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { isPublic } = await request.json();

    const shareLink = await prisma.shareLink.update({
      where: { analysisId: params.id },
      data: { isPublic: isPublic ?? false },
    });

    return NextResponse.json({
      shareToken: shareLink.token,
      isPublic: shareLink.isPublic,
    });
  } catch (error) {
    console.error('Update share link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    const user = await getUserFromSession(token || null);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
    });

    if (!analysis || analysis.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.shareLink.delete({
      where: { analysisId: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete share link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

