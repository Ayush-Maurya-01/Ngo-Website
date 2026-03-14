import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, interests, message } = body;

    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('volunteers')
      .insert([{ 
        full_name, 
        email, 
        phone, 
        interests, 
        message,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already registered as a volunteer.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to register volunteer.' },
        { status: 500 }
      );
    }

    // --- Send Welcome Email ---
    try {
      const { sendVolunteerWelcomeEmail } = await import('@/lib/email');
      // For general volunteers, we use 'Our Volunteer Force' as the program name
      await sendVolunteerWelcomeEmail(email, full_name, interests || 'Our NGO Pillar');
    } catch (emailErr) {
      console.error('Failed to send volunteer welcome email:', emailErr);
    }

    return NextResponse.json(
      { message: 'Registration successful!', data },
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
