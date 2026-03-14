import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donor_name, donor_email, amount, frequency } = body;

    if (!donor_name || !donor_email || !amount || !frequency) {
      return NextResponse.json(
        { error: 'Missing required donor information.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('donations')
      .insert([{ 
        donor_name, 
        donor_email, 
        amount, 
        frequency,
        status: 'completed'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to record donation.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Donation recorded successfully!', data },
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
