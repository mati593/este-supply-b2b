/**
 * Supabase client placeholder.
 * Install @supabase/supabase-js and uncomment createClient() once env vars are set.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type SupabaseClient = unknown;

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured) return null;

  // Future: dynamic import after installing @supabase/supabase-js
  // const { createClient } = await import("@supabase/supabase-js");
  // return createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );

  return null;
}
