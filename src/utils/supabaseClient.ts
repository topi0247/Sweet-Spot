import { Post } from "@/types";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export async function registerUser(
  displayName: string,
  email: string,
  uid: string
) {
  try {
    const { data: checkData, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (!!checkData && checkData.length > 0) {
      const { data, error } = await supabase
        .from("users")
        .update({ displayName, uid })
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
      .select("id, uid, displayName")
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
      .select("id, uid, displayName")
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

    // 各データのタグを取得
    let posts: Post[] = [];
    posts = await Promise.all(
      data.map(async (post) => {
        const postTags = [] as string[];
        const { data: tags, error: tagError } = await supabase
          .from("post_tags")
          .select("tag_id(*)")
          .eq("post_id", post.id);
        if (tagError) {
          return { error, status: 500 };
        }

        tags.forEach((tag: any) => {
          postTags.push(tag.tag_id.name);
        });
        return { ...post, tags: postTags };
      })
    );

    const { data: countData, error: countError } = await supabase
      .from("posts")
      .select("id", { count: "exact" });
    if (countError) {
      return { error, status: 500 };
    }

    return { posts, count: countData.length };
  } catch (error: any) {
    return { error, status: 500 };
  }
}

export async function getPost(uid: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`*,user_id: user_id(*)`)
    .eq("uid", uid)
    .limit(1);
  if (error) {
    return { error, status: 500 };
  }

  const tags = await getTags(data[0].id);

  return { post: { ...data[0], tags }, status: 200 };
}

export async function deletePost(id: number) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    return { error, status: 500 };
  }
  return { status: 200 };
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

async function getTags(postId: number) {
  const { data, error } = await supabase
    .from("post_tags")
    .select("tag_id(*)")
    .eq("post_id", postId);
  if (error) {
    return { error, status: 500 };
  }

  const tags = data.map((tag: any) => tag.tag_id.name);
  return tags;
}
