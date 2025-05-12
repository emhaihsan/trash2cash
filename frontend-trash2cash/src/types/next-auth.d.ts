import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Menambahkan tipe untuk JWT
   */
  interface JWT {
    userId?: string;
  }

  /**
   * Menambahkan tipe untuk Session
   */
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}
