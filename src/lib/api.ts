import supabase from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export async function getFullUserProfile(user: User) {
  const { data, error } = await supabase
    .from("users")
    .select("name, bio")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("❌ Failed to fetch full user profile:", error);
    return null;
  }

  return data;
}
