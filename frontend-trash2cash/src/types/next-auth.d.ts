import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extending the built-in session types
   */
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
    };
  }
}
