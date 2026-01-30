import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('valentine_token');
    const userToken = tokenCookie?.value;
    
    const { env } = await getCloudflareContext();
    const validToken = process.env.VALENTINE_TOKEN;

    if (!userToken || userToken !== validToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { noCount, action } = body as never; // action: 'yes' | 'no'

    if (typeof noCount !== 'number' || !['yes', 'no'].includes(action)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const uniqueId = crypto.randomUUID();
    // Use the action in the key for easier filtering in the dashboard
    const key = `${action}-${timestamp}-${uniqueId}`;
    
    const data = {
      action,
      timestamp,
      noCount,
      name: process.env.PARTNER_NAME || 'Unknown',
    };

    if (env.VALENTINE_KV) {
        await env.VALENTINE_KV.put(key, JSON.stringify(data));
        return NextResponse.json({ success: true });
    } else {
        console.error("VALENTINE_KV binding not found");
        return NextResponse.json({ error: 'KV not configured' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error recording event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}