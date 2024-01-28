import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : process.env.SUPABASE_URL! ?? "";
const SUPABASE_ANON_KEY =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : process.env.SUPABASE_ANON_KEY! ?? "";

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
      if (checkError || error) {
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

export async function getUserByEmail(email: string) {
  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("id, uuid, displayName")
      .eq("email", email)
      .limit(1);

    if (error) {
      throw error;
    }

    if (user === null) {
      return null;
    }

    return user[0];
  } catch (error: any) {
    console.error("ユーザー検索中にエラーが発生しました:", error.message);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("id, uuid, displayName")
      .eq("id", id)
      .limit(1);

    if (error) {
      throw error;
    }

    if (user === null) {
      return null;
    }
    console.log(user[0]);
    return user[0];
  } catch (error: any) {
    console.error("ユーザー検索中にエラーが発生しました:", error.message);
    throw error;
  }
}

export async function postPost(url: string, comment: string, id: number) {
  try {
    const { data, error } = await supabase.from("posts").insert([
      {
        url,
        comment,
        user_id: id,
      },
    ]);
    if (error) {
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error("データの登録中にエラーが発生しました:", error.message);
    throw error;
  }
}

export async function getPosts(range: [number, number]) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        uuid,
        url,
        comment,
        created_at,
        user_id (
          displayName
        )
      `
      )
      .range(range[0], range[1])
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("データの取得中にエラーが発生しました:", error.message);
    throw error;
  }
}
