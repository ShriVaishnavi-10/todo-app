import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ [SupabaseServer] ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in production.");
} else {
  console.log("📡 [SupabaseServer] Initializing...");
  // Log the URL structure for debugging (masking sensitive parts)
  console.log("🔗 URL Sample:", supabaseUrl.substring(0, 12) + "..." + supabaseUrl.slice(-5));
  if (!supabaseUrl.startsWith('https://')) {
    console.error("⚠️ [SupabaseServer] WARNING: SUPABASE_URL does not start with https:// - Fetch will likely fail.");
  }
}

export const supabaseServer = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseServiceKey || "placeholder-key"
);
