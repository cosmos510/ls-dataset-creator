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

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const imagePaths = [];
    const batchSize = 5;

    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);

      for (const base64Image of batch) {
        const imageName = `${letter}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(imageName, Buffer.from(base64Image.split(',')[1], 'base64'), {
            contentType: 'image/jpeg',
          });

        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }

        imagePaths.push(data.path);
      }

      const { data: insertData, error: insertError } = await supabase
        .from('photo')
        .insert([
          {
            user_id: user.id,
            letter,
            image_paths: imagePaths,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error saving metadata:', insertError);
        return NextResponse.json({ error: 'Error saving metadata' }, { status: 500 });
      }

      const { data: countData, error: countError } = await supabase
        .from('photo_counts')
        .select('count')
        .eq('letter', letter)
        .single();

      if (countError && countError.code === 'PGRST116') {
        const { error: insertCountError } = await supabase
          .from('photo_counts')
          .insert([{ letter, count: batch.length }]);

        if (insertCountError) {
          console.error('Error inserting photo count:', insertCountError);
          return NextResponse.json({ error: 'Error inserting photo count' }, { status: 500 });
        }
      } else if (countData) {
        const { error: updateError } = await supabase
          .from('photo_counts')
          .update({ count: countData.count + batch.length })
          .eq('letter', letter);

        if (updateError) {
          console.error('Error updating photo count:', updateError);
          return NextResponse.json({ error: 'Error updating photo count' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Images saved, metadata stored, and photo count updated!',
      data: imagePaths,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}