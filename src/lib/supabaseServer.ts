import { createClient } from "@supabase/supabase-js";

// Priority: Private ENV -> Public ENV -> Placeholder
const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sanitize: Trim spaces/quotes and handle trailing slashes
const supabaseUrl = rawUrl?.trim().replace(/\/$/, "");
const supabaseServiceKey = rawKey?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ [SupabaseServer] ERROR: Database credentials missing in Vercel.");
  console.log("💡 Ensure both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in Vercel Settings.");
} else {
  console.log("📡 [SupabaseServer] Connecting to:", supabaseUrl.substring(0, 12) + "...");
  
  if (!supabaseUrl.startsWith('https://')) {
    console.error("❌ [SupabaseServer] MALFORMED URL: Must start with https://. Current:", supabaseUrl.substring(0, 10));
  }
}

export const supabaseServer = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseServiceKey || "placeholder-key"
);
