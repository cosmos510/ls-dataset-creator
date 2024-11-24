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

    const uploadedImages = [];
    const imagePaths = [];
    const batchSize = 5; // Set the batch size to 5 images per batch

    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize); // Get a batch of images

      // Upload the images in this batch
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

      // Insert metadata for this batch
      
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

      uploadedImages.push(insertData);
    }

    return NextResponse.json({
      success: true,
      message: 'Images saved and metadata stored!',
      data: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}