import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/server';

/**
 * Clerk Billing / auth webhook endpoint.
 *
 * For now this endpoint:
 * - Verifies the Svix signature using CLERK_WEBHOOK_SECRET
 * - Logs the event type and a few identifiers
 *
 * In the payment lessons, we will:
 * - Sync subscription status into Supabase
 * - Drive feature gating based on plan (cm_operator)
 */

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!CLERK_WEBHOOK_SECRET) {
    console.warn('[CLERK_WEBHOOK] CLERK_WEBHOOK_SECRET is not configured');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let event: WebhookEvent;

  try {
    event = await verifyWebhook({
      secret: CLERK_WEBHOOK_SECRET,
      payload,
      headers,
    });
  } catch (error) {
    console.error('[CLERK_WEBHOOK] Signature verification failed', error);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = event;

  console.log('[CLERK_WEBHOOK] Received event', {
    type,
    id: (data as { id?: string } | undefined)?.id,
  });

  // TODO (Stage 2 – Payment Gates):
  // - On subscriptionItem.active / .canceled / .ended / .pastDue, upsert into Supabase
  // - Keep a subscriptions table in sync keyed by Clerk user ID + plan (cm_operator)

  return new NextResponse('Webhook received', { status: 200 });
}

