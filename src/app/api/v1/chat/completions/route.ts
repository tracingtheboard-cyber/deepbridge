import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const userApiKey = authHeader?.replace('Bearer ', '');

  if (!userApiKey || !userApiKey.startsWith('db-')) {
    return NextResponse.json({ error: 'Invalid or missing DeepBridge API Key.' }, { status: 401 });
  }

  // 1. Verify API Key and check balance
  const { data: profile, error: authError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('api_key', userApiKey)
    .single();

  if (authError || !profile) {
    return NextResponse.json({ error: 'Unauthorized: Invalid API Key.' }, { status: 403 });
  }

  if (profile.balance_tokens <= 0) {
    return NextResponse.json({ error: 'Insufficient balance. Please top up.' }, { status: 402 });
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  try {
    const body = await req.json();

    // Ensure we get usage data even in stream
    if (body.stream) {
      body.stream_options = { include_usage: true };
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Handle Streaming with background usage logging
    if (body.stream) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) return;

          let totalTokens = 0;

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              controller.enqueue(value);

              // Simple logic to find usage in the last chunk of SSE
              if (chunk.includes('"usage"')) {
                try {
                  const lines = chunk.split('\n');
                  for (const line of lines) {
                    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                      const jsonStr = line.slice(6);
                      const parsed = JSON.parse(jsonStr);
                      if (parsed.usage) {
                        totalTokens = parsed.usage.total_tokens;
                      }
                    }
                  }
                } catch (e) { /* ignore parse errors */ }
              }
            }
          } finally {
            // Deduct tokens in background after stream finishes
            if (totalTokens > 0) {
              await supabaseAdmin.rpc('deduct_tokens', {
                user_id: profile.id,
                amount: totalTokens
              });
            }
            controller.close();
            reader.releaseLock();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Handle Non-Streaming
    const data = await response.json();
    const totalTokens = data.usage?.total_tokens || 0;

    if (totalTokens > 0) {
      const { error: deductError } = await supabaseAdmin.rpc('deduct_tokens', {
        user_id: profile.id,
        amount: totalTokens
      });
      if (deductError) {
        console.error('Deduction Error:', deductError);
      } else {
        console.log(`Successfully deducted ${totalTokens} tokens from user ${profile.id}`);
      }
    }

    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
