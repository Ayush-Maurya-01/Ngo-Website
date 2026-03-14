import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save contact message.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully!', data },
      { status: 201 }
    );
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
