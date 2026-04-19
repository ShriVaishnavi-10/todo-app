import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {supabaseServer} from "@/lib/supabaseServer";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email) {
          console.error("❌ Signin failed: No user email provided by Google.");
          return false;
        }
        
        console.log("🔍 [Auth] Attempting sign-in for:", user.email);
        
        // 1. Check if user already exists
        const { data: existingUser, error: selectError } = await supabaseServer
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
        
        if (selectError && selectError.code !== 'PGRST116') {
          console.error("❌ [Auth] Supabase User Check failed:", selectError.message);
          console.error("💡 TIP: Make sure your 'users' table exists in Supabase!");
          return false; // Stop the login if we can't check for the user
        }

        // 2. If user does NOT exist → create new user
        if (!existingUser) {
          const { error: insertError } = await supabaseServer.from("users").insert({
            name: user.name,
            email: user.email,
            avatar_url: user.image
          });
          
          if (insertError) {
            console.error("❌ [Auth] Supabase User Creation failed:", insertError.message);
            return false;
          }
          console.log("✅ [Auth] New user registered in Supabase");
        } else {
          console.log("✅ [Auth] Existing user identified");
        }

        return true; 
      } catch (error) {
        console.error("❌ [Critical] Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token }) {
      try {
        // Fetch the user's Supabase profile using email
        if (token.email) {
          const { data: dbUser, error } = await supabaseServer
            .from("users")
            .select("*")
            .eq("email", token.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("JWT callback Supabase error:", error);
          }

          if (dbUser) {
            token.id = dbUser.id; // SUPABASE UUID ✔
          }
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
