import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from '@/services/supabase';


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/"
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // Cek user di Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
  
        if (!existingUser) {
          const { data: newUser } = await supabase
            .from('users')
            .insert([{ email: user.email, name: user.name, image: user.image }])
            .select()
            .single();
          token.userId = newUser.id;
        } else {
          token.userId = existingUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        return session;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url, "Base URL:", baseUrl); // Tambahkan logging
      // Redirect to dashboard after sign in
      if (url.startsWith("/")) {
        return `${baseUrl}/dashboard`;
      } else if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      // If it's an absolute URL, allow it
      else if (url.startsWith("http")) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    }
  },
});

export { handler as GET, handler as POST };