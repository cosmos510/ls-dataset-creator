import supabase from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // On appelle la fonction RPC qu'on vient de créer
    const { data, error } = await supabase.rpc('get_letter_stats');

    if (error) {
      console.error('Error fetching photo counts:', error);
      return NextResponse.json({ error: 'Error fetching photo counts' }, { status: 500 });
    }

    // Le format retourné par RPC est déjà un tableau [{letter: 'a', count: 10}, ...]
    return NextResponse.json({ 
      success: true, 
      data: data 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}