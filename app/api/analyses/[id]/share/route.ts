import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';
import crypto from 'crypto';

// Type assertion for ShareLink model (available after Prisma client generation)
const prismaWithShareLink = prisma as typeof prisma & {
  shareLink: {
    findFirst: (args: { where: { analysisId: string } }) => Promise<{ id: string; token: string; isPublic: boolean } | null>;
    findUnique: (args: { where: { token: string }; include?: { analysis: boolean } }) => Promise<any>;
    create: (args: { data: { analysisId: string; token: string; isPublic: boolean } }) => Promise<{ id: string; token: string; isPublic: boolean }>;
    update: (args: { where: { id: string }; data: { isPublic: boolean } }) => Promise<{ id: string; token: string; isPublic: boolean }>;
    delete: (args: { where: { id: string } }) => Promise<any>;
  };
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    console.log('Creating share link for analysis:', params.id);
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
    let existingShareLink;
    try {
      existingShareLink = await prismaWithShareLink.shareLink.findFirst({
        where: { analysisId: params.id },
      });
    } catch (dbError) {
      console.error('Database error finding share link:', dbError);
      throw dbError;
    }

    if (existingShareLink) {
      return NextResponse.json({
        shareToken: existingShareLink.token,
        isPublic: existingShareLink.isPublic,
      });
    }

    // Generate unique token
    const shareToken = crypto.randomBytes(32).toString('hex');
    console.log('Generated share token:', shareToken);

    let shareLink;
    try {
      shareLink = await prismaWithShareLink.shareLink.create({
        data: {
          analysisId: params.id,
          token: shareToken,
          isPublic: false,
        },
      });
      console.log('Share link created successfully:', shareLink.id);
    } catch (createError) {
      console.error('Error creating share link:', createError);
      throw createError;
    }

    return NextResponse.json({
      shareToken: shareLink.token,
      isPublic: shareLink.isPublic,
    });
  } catch (error) {
    console.error('Create share link error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined
        })
      },
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

    const shareLink = await prismaWithShareLink.shareLink.findFirst({
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

    const existingShareLink = await prismaWithShareLink.shareLink.findFirst({
      where: { analysisId: params.id },
    });

    if (!existingShareLink) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

      const shareLink = await prismaWithShareLink.shareLink.update({
      where: { id: existingShareLink.id },
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

    const existingShareLink = await prismaWithShareLink.shareLink.findFirst({
      where: { analysisId: params.id },
    });

    if (existingShareLink) {
      await prismaWithShareLink.shareLink.delete({
        where: { id: existingShareLink.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete share link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


