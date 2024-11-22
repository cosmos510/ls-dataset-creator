import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Invalid data. Images array is required.' },
        { status: 400 }
      );
    }
    console.log(`Received ${images.length} images`);
    return NextResponse.json({ success: true, message: 'Images saved!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}