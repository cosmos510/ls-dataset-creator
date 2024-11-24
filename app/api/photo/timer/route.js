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
            user_id: userId,
            letter,
            image_paths: imagePaths,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error saving metadata:', insertError);
        return NextResponse.json({ error: 'Error saving metadata' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Images saved and metadata stored!',
      data: imagePaths,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}