import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BRDRequirements } from '@/lib/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const params = await context.params;
    const shareLink = await prisma.shareLink.findUnique({
      where: { token: params.token },
      include: { analysis: true },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Share link has expired' },
        { status: 403 }
      );
    }

    // Check if analysis is public or if user has access
    // For now, we'll allow access if the link exists (private links)
    // In the future, you might want to add authentication for private links

    const requirements: BRDRequirements = JSON.parse(shareLink.analysis.requirements);

    return NextResponse.json({
      analysis: {
        id: shareLink.analysis.id,
        documentName: shareLink.analysis.documentName,
        requirements,
        createdAt: shareLink.analysis.createdAt,
        isPublic: shareLink.isPublic,
      },
    });
  } catch (error) {
    console.error('Get shared analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

