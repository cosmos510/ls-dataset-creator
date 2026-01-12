import { supabaseAdmin } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // 1. Récupérer la session sécurisée du serveur
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      console.error('Tentative d\'accès non autorisé à l\'API');
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous reconnecter.' }, { status: 401 });
    }

    // 2. Parser les données de la requête
    const { images, letter } = await req.json();
    const userId = session.user.id; // L'UUID récupéré de la session NextAuth

    if (!images || !Array.isArray(images) || !letter) {
      return NextResponse.json(
        { error: 'Données invalides. Tableaux d\'images et lettre requis.' },
        { status: 400 }
      );
    }

    const photoRecords = [];

    // 3. Boucle d'upload des images vers le Storage
    for (const base64Image of images) {
      // Génération d'un nom de fichier unique
      const imageName = `${letter}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      // Conversion du base64 en Buffer pour l'upload
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

      // Préparation de l'objet pour la table 'photo'
      photoRecords.push({
        user_id: userId,
        letter: letter,
        file_path: storageData.path,
      });
    }

    // 4. Insertion des métadonnées dans la table 'photo'
    // On utilise supabaseAdmin pour éviter les erreurs de violation RLS (code 42501)
    const { error: insertError } = await supabaseAdmin
      .from('photo')
      .insert(photoRecords);

    if (insertError) {
      console.error('Erreur Insertion Table Photo (RLS?):', JSON.stringify(insertError));
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement en base de données' }, { status: 500 });
    }

    // 5. Réponse de succès
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