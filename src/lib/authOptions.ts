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

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email) return false;
        console.log("SignIn attempt for:", user.email);
        
        // 1. Check if user already exists
        const { data: existingUser, error: selectError } = await supabaseServer
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
        
        if (selectError && selectError.code !== 'PGRST116') {
          console.error("Supabase select error:", selectError);
          throw selectError;
        }

        console.log("Existing user status:", existingUser ? "Found" : "Not Found");
        
        // 2. If user does NOT exist → create new user
        if (!existingUser) {
          const { error: insertError } = await supabaseServer.from("users").insert({
            name: user.name,
            email: user.email,
            avatar_url: user.image
          });
          
          if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw insertError;
          }
          console.log("New user created in Supabase");
        }

        return true; // allow login
      } catch (error) {
        console.error("Error in signIn callback:", error);
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
