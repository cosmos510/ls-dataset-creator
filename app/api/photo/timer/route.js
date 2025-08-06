import supabase from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { images, letter, userId } = await req.json();

    if (!images || !Array.isArray(images) || !letter || !userId) {
      return NextResponse.json(
        { error: 'Invalid data. Images array, letter, and userId are required.' },
        { status: 400 }
      );
    }

    // Validate user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const photoRecords = [];

    // Upload all images and prepare records
    for (const base64Image of images) {
      const imageName = `${letter}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(imageName, Buffer.from(base64Image.split(',')[1], 'base64'), {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
      }

      photoRecords.push({
        user_id: user.id,
        letter,
        file_path: data.path,
      });
    }

    // Insert all photo records
    const { error: insertError } = await supabase.from('photo').insert(photoRecords);

    if (insertError) {
      console.error('Error saving metadata:', insertError);
      return NextResponse.json({ error: 'Error saving metadata' }, { status: 500 });
    }

    // Update or insert photo count
    const { data: countData, error: countError } = await supabase
      .from('photo_counts')
      .select('count')
      .eq('letter', letter)
      .single();

    if (countError && countError.code === 'PGRST116') {
      // Row not found, insert new
      const { error: insertCountError } = await supabase
        .from('photo_counts')
        .insert([{ letter, count: images.length }]);

      if (insertCountError) {
        console.error('Error inserting photo count:', insertCountError);
        return NextResponse.json({ error: 'Error inserting photo count' }, { status: 500 });
      }
    } else if (countData) {
      // Row found, update count
      const { error: updateError } = await supabase
        .from('photo_counts')
        .update({ count: countData.count + images.length })
        .eq('letter', letter);

      if (updateError) {
        console.error('Error updating photo count:', updateError);
        return NextResponse.json({ error: 'Error updating photo count' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All images uploaded and metadata saved successfully!',
      data: photoRecords.map(r => r.file_path),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}