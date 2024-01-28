import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export async function registerUser(displayName: string, email: string) {
  try {
    const { data: checkData, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (!!checkData && checkData.length > 0) {
      const { data, error } = await supabase
        .from("users")
        .update({ displayName: displayName })
        .eq("email", email)
        .select();
      if (error) {
        throw error;
      }

      return data;
    } else {
      const { data, error } = await supabase.from("users").insert([
        {
          displayName,
          email,
        },
      ]);

      if (error) {
        throw error;
      }

      return data;
    }
  } catch (error: any) {
    console.error("データの登録中にエラーが発生しました:", error.message);
    throw error;
  }
}
