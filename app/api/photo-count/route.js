import supabase from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get counts directly from photo table
    const { data, error } = await supabase
      .from('photo')
      .select('letter')
      .order('letter');

    if (error) {
      console.error('Error fetching photo counts:', error);
      return NextResponse.json({ error: 'Error fetching photo counts' }, { status: 500 });
    }

    // Count photos by letter
    const counts = {};
    data.forEach(photo => {
      counts[photo.letter] = (counts[photo.letter] || 0) + 1;
    });

    return NextResponse.json({ success: true, counts });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}