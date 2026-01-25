import { supabaseAdmin } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      console.error('Tentative d\'accès non autorisé à l\'API');
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous reconnecter.' }, { status: 401 });
    }

    const { images, letter } = await req.json();
    const userId = session.user.id;

    if (!images || !Array.isArray(images) || !letter) {
      return NextResponse.json(
        { error: 'Données invalides. Tableaux d\'images et lettre requis.' },
        { status: 400 }
      );
    }

    const photoRecords = [];

    for (const base64Image of images) {
      const imageName = `${letter}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { data: storageData, error: storageError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(imageName, Buffer.from(base64Image.split(',')[1], 'base64'), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (storageError) {
        console.error('Erreur Storage Supabase:', JSON.stringify(storageError));
        return NextResponse.json({ error: 'Échec de l\'upload de l\'image' }, { status: 500 });
      }

      photoRecords.push({
        user_id: userId,
        letter: letter,
        file_path: storageData.path,
      });
    }

    const { error: insertError } = await supabaseAdmin
      .from('photo')
      .insert(photoRecords);

    if (insertError) {
      console.error('Erreur Insertion Table Photo (RLS?):', JSON.stringify(insertError));
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement en base de données' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Images et métadonnées enregistrées avec succès !',
      data: photoRecords.map(r => r.file_path),
    });

  } catch (error) {
    console.error('Erreur serveur critique:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}