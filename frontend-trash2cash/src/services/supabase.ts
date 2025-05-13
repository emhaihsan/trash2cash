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

// Fungsi untuk menyimpan gambar sampah
export async function uploadTrashImage(userId: string, file: File) {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `trash/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('trash-images')
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
      .from('trash-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading trash image:', error);
    throw error;
  }
}

// Fungsi untuk menyimpan hasil deteksi sampah
export async function saveTrashSubmission(
  userId: string, 
  imageUrl: string, 
  detectedItems: { name: string; category: string; tokenValue: number }[],
  totalTokens: number
) {
  try {
    // 1. Simpan submission ke tabel submissions
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        items_count: detectedItems.length,
        total_tokens: totalTokens,
        status: 'completed'
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Supabase submission error:', submissionError);
      throw submissionError;
    }

    // 2. Simpan item terdeteksi ke tabel submission_items
    const submissionItems = detectedItems.map(item => ({
      submission_id: submission.id,
      name: item.name,
      category: item.category,
      token_value: item.tokenValue
    }));

    const { error: itemsError } = await supabase
      .from('submission_items')
      .insert(submissionItems);

    if (itemsError) {
      console.error('Supabase submission items error:', itemsError);
      throw itemsError;
    }

    // 3. Update statistik user
    const { error: statsError } = await supabase.rpc('update_user_stats', {
      user_id: userId,
      items_count: detectedItems.length,
      tokens_earned: totalTokens
    });

    if (statsError) {
      console.error('Supabase stats update error:', statsError);
      throw statsError;
    }

    // 4. Tambahkan aktivitas baru
    const { error: activityError } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        activity_type: 'Recycling',
        description: `Submitted ${detectedItems.length} item(s) for recycling`,
        status: 'success',
        metadata: {
          items: detectedItems.map(item => item.name),
          tokens: totalTokens
        }
      });

    if (activityError) {
      console.error('Supabase activity error:', activityError);
      throw activityError;
    }

    return submission;
  } catch (error) {
    console.error('Error saving trash submission:', error);
    throw error;
  }
}

// Fungsi untuk update statistik user secara manual jika RPC tidak tersedia
export async function updateUserStats(userId: string, itemsCount: number, tokensEarned: number) {
  try {
    // Dapatkan statistik user saat ini
    const currentStats = await getUserStats(userId);
    
    // Update statistik
    const { error } = await supabase
      .from('users')
      .update({
        submissions: currentStats.submissions + 1,
        items_recycled: currentStats.itemsRecycled + itemsCount,
        total_tokens: currentStats.totalTokens + tokensEarned
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase stats update error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

// Fungsi untuk update statistik user setelah submit recycling
export async function updateUserRecyclingStats(
  userId: string, 
  items: { name: string; category: string; tokenValue: number }[],
  imageBase64?: string // Optional, tidak perlu disimpan
) {
  try {
    // Hitung total token dan jumlah item
    const totalTokens = items.reduce((sum, item) => sum + item.tokenValue, 0);
    const itemCount = items.length;
    
    // 1. Update statistik user
    const { data: userData, error: userError } = await supabase.rpc(
      'increment_user_stats',
      { 
        user_id: userId,
        items_count: itemCount,
        tokens_count: totalTokens,
        submissions_count: 1
      }
    );

    if (userError) {
      console.error('Error updating user stats:', userError);
      throw userError;
    }

    // 2. Buat deskripsi untuk aktivitas
    const itemCategories: Record<string, number> = {};
    items.forEach(item => {
      itemCategories[item.category] = (itemCategories[item.category] || 0) + 1;
    });
    
    const description = Object.entries(itemCategories)
      .map(([category, count]) => `${count} ${category} item${count > 1 ? 's' : ''}`)
      .join(', ');

    // 3. Rekam aktivitas recycling
    const { data: activityData, error: activityError } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userId,
          activity_type: 'Recycling',
          description: `Submitted ${description}`,
          tokens_earned: totalTokens,
          items_count: itemCount,
          status: 'success'
        }
      ]);

    if (activityError) {
      console.error('Error recording activity:', activityError);
      throw activityError;
    }

    return {
      success: true,
      tokensEarned: totalTokens,
      itemsRecycled: itemCount
    };
  } catch (error) {
    console.error('Error updating recycling stats:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan data leaderboard
export async function getLeaderboardData(timeframe: 'weekly' | 'monthly' | 'alltime' = 'weekly', limit: number = 10) {
  try {
    let query = supabase
      .from('users')
      .select('id, name, image, items_recycled, total_tokens, submissions');

    // Filter berdasarkan timeframe jika diperlukan
    // Dalam implementasi nyata, Anda mungkin perlu tabel terpisah untuk statistik berdasarkan waktu
    // atau menggunakan activities dengan filter tanggal
    
    // Untuk demo, kita gunakan data dari tabel users tanpa filter waktu
    
    // Urutkan berdasarkan total token (bisa disesuaikan dengan kriteria lain)
    query = query.order('total_tokens', { ascending: false }).limit(limit);
    
    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    // Transform data to match LeaderboardUser interface and add rank
    const leaderboardData = data.map((user, index) => ({
      id: user.id,
      name: user.name || 'Anonymous User',
      image: user.image,
      totalItems: user.items_recycled || 0,
      totalTokens: user.total_tokens || 0,
      totalSubmissions: user.submissions || 0,
      rank: index + 1
    }));
    
    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan peringkat user tertentu
export async function getUserRank(userId: string, timeframe: 'weekly' | 'monthly' | 'alltime' = 'weekly') {
  try {
    // Dapatkan semua user yang diurutkan berdasarkan token
    const { data, error } = await supabase
      .from('users')
      .select('id, total_tokens')
      .order('total_tokens', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    // Cari peringkat user
    const userIndex = data.findIndex(user => user.id === userId);
    
    return userIndex !== -1 ? userIndex + 1 : null;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return null;
  }
}
