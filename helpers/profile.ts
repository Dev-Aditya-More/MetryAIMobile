import { supabase } from "@/utils/supabaseClient";
import { Database } from "@/types/database";

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Database["public"]["Tables"]["profiles"]["Row"]>();

  if (error) throw error;
  return data;
}
