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

    // Count photos by letter and format as array
    const counts = {};
    data.forEach(photo => {
      counts[photo.letter] = (counts[photo.letter] || 0) + 1;
    });

    // Convert to array format expected by frontend
    const letterCountsArray = Object.entries(counts).map(([letter, count]) => ({
      letter,
      count
    }));

    return NextResponse.json({ success: true, data: letterCountsArray });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}