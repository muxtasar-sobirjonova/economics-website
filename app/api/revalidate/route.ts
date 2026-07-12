import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

// This is a generic Next.js route handler for Sanity webhooks.
export async function POST(req: NextRequest) {
  try {
    // You should verify the webhook signature here using @sanity/webhook if configured
    const body = await req.json();

    if (body._type === 'lesson' || body._type === 'concept' || body._type === 'quiz') {
      revalidateTag('sanity');
      return NextResponse.json({ message: 'Cache invalidated', timestamp: Date.now() }, { status: 200 });
    }

    return NextResponse.json({ message: 'No action taken', timestamp: Date.now() }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
