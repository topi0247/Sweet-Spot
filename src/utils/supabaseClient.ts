import { createClient } from "@supabase/supabase-js";

// const SUPABASE_URL =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_SUPABASE_URL!
//     : process.env.SUPABASE_URL! ?? "";
// const SUPABASE_ANON_KEY =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     : process.env.SUPABASE_ANON_KEY! ?? "";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    return { error, status: 500 };
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
    return { error, status: 500 };
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
    return user[0];
  } catch (error: any) {
    return { error, status: 500 };
  }
}

export async function postPost(
  url: string,
  comment: string,
  id: number,
  genre: string,
  tags: string[],
  moreComment: string
) {
  try {
    // データの登録
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          url,
          comment,
          user_id: id,
          genre,
          more_comment: moreComment,
        },
      ])
      .select();
    if (error) {
      return { error, status: 500 };
    }

    // タグの登録と取得
    const tagIds = await Promise.all(
      tags
        .map(async (tagName) => await getTagId(tagName))
        .filter((tagId) => tagId !== null)
    );
    console.log(tagIds);
    const postId = data ? (data[0] as { id: number }).id : null;

    // 中間テーブルに登録
    if (tags.length > 0 && postId !== null) {
      const { error: tagError } = await supabase.from("post_tags").insert(
        tagIds.map((tagId) => ({
          post_id: postId,
          tag_id: tagId,
        }))
      );
      if (tagError) {
        return { error, status: 500 };
      }
    }

    return { data, status: 200 };
  } catch (error: any) {
    return { error, status: 500 };
  }
}

export async function getPosts(range: [number, number]) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*,user_id: user_id(*)`)
      .range(range[0], range[1])
      .order("created_at", { ascending: false });
    if (error) {
      return { error, status: 500 };
    }

    const { data: countData, error: countError } = await supabase
      .from("posts")
      .select("id", { count: "exact" });
    if (countError) {
      return { error, status: 500 };
    }

    return { data, count: countData.length };
  } catch (error: any) {
    return { error, status: 500 };
  }
}

async function findTagByName(tagName: string) {
  const { data } = await supabase
    .from("tags")
    .select("id")
    .eq("name", tagName)
    .single();
  return data;
}

async function getTagId(tagName: string) {
  let tagId;
  const existingTag = await findTagByName(tagName);
  if (existingTag && "id" in existingTag) {
    tagId = existingTag.id;
  } else {
    const newTag: any = await createTag(tagName);
    tagId = newTag?.id ?? null;
  }

  return tagId;
}

async function createTag(tagName: string) {
  const { data } = await supabase
    .from("tags")
    .insert({
      name: tagName,
    })
    .select();
  return data ? data[0] : null;
}
