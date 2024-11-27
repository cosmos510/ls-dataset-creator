import supabase from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { data, error } = await supabase
      .from('photo_counts')
      .select('letter, count');

    if (error) {
      console.error('Error fetching photo counts:', error);
      return NextResponse.json({ error: 'Error fetching photo counts' }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}