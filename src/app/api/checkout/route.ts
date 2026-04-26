import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { userId, planId } = await req.json();

    // Define pricing plans
    const plans = {
      'basic': { name: '2M Tokens', amount: 100, tokens: 2000000 }, // $1.00
      'pro': { name: '10M Tokens', amount: 450, tokens: 10000000 }, // $4.50
      'ultra': { name: '25M Tokens', amount: 1000, tokens: 25000000 }, // $10.00
    };

    const plan = plans[planId as keyof typeof plans];
    if (!plan) return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `DeepBridge Credits: ${plan.name}`,
              description: `Add ${plan.tokens.toLocaleString()} tokens to your account.`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
      metadata: {
        userId: userId,
        tokenAmount: plan.tokens.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
