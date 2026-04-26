import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const tokenAmount = parseInt(session.metadata.tokenAmount);

    if (userId && tokenAmount) {
      // Add tokens to user's balance in Supabase
      const { error } = await supabaseAdmin.rpc('add_tokens', {
        user_id: userId,
        amount: tokenAmount
      });

      if (error) {
        console.error('Failed to add tokens:', error);
        return NextResponse.json({ error: 'DB Error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
