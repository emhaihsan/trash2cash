import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fungsi untuk upload gambar profil
export async function uploadProfileImage(userId: string, file: File) {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // Dapatkan public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Fungsi untuk update profil user
export async function updateUserProfile(userId: string, updates: { name?: string; image?: string }) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan data user
export async function getUserData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Fungsi untuk menghapus profil user
export async function deleteUserProfile(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan statistik user
export async function getUserStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('submissions, items_recycled, total_tokens')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    
    return {
      submissions: data.submissions || 0,
      itemsRecycled: data.items_recycled || 0,
      totalTokens: data.total_tokens || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan aktivitas terbaru user
export async function getUserActivities(userId: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
}
