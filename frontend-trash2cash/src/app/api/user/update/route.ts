import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/services/supabase";

export async function PUT(request: NextRequest) {
  // Verifikasi session
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, image } = await request.json();
    
    // Update user di Supabase
    const { data, error } = await supabase
      .from('users')
      .update({ 
        name: name,
        image: image 
      })
      .eq('email', session.user.email)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: data 
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
