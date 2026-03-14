import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, full_name, email, phone, message } = body;

    if (!event_id || !full_name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([
        { event_id, full_name, email, phone, message }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // --- Send Email Notification ---
    try {
      const { data: eventData } = await supabase
        .from('events')
        .select('title, event_date, location')
        .eq('id', event_id)
        .single();

      if (eventData) {
        const { sendEventRegistrationEmail } = await import('@/lib/email');
        await sendEventRegistrationEmail(
          email,
          full_name,
          eventData.title,
          eventData.event_date,
          eventData.location
        );
      }
    } catch (emailErr) {
      console.error('Failed to send registration email:', emailErr);
      // We don't return error here because the registration was still successful in DB
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Event registration API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
