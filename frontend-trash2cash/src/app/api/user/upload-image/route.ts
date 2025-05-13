import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/services/supabase";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  // Verifikasi session
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Cek tipe file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Cek ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 });
    }

    // Dapatkan user ID dari Supabase
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Konversi File ke ArrayBuffer untuk kompresi
    const bytes = await file.arrayBuffer();
    
    // Kompresi gambar menggunakan sharp
    const compressedImageBuffer = await sharp(Buffer.from(bytes))
      .resize(300, 300, { // Resize ke 300x300 pixels
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ // Konversi ke JPEG dengan kualitas 80%
        quality: 80,
        progressive: true
      })
      .toBuffer();
    
    // Generate nama file unik
    const fileName = `${userData.id}-${Date.now()}.jpg`; // Selalu gunakan jpg untuk hasil kompresi
    const filePath = fileName;

    // Upload file ke Supabase Storage
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, compressedImageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dapatkan public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user profile dengan URL gambar baru
    const { error: updateError } = await supabase
      .from('users')
      .update({ image: publicUrl })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl 
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
