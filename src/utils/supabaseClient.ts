import { PostData } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { get } from "http";

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
          uid,
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

export async function updateUser(id: number, name: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ displayName: name })
      .eq("id", id);
    if (error) {
      throw error;
    }

    return { status: 200 };
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

export async function getUserByUid(uid: string) {
  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("id, uid, displayName")
      .eq("uid", uid)
      .single();

    if (error) {
      throw error;
    }

    if (user === null) {
      return null;
    }
    return user;
  } catch (error: any) {
    return null;
  }
}

export async function deleteUserByUid(uid: string) {
  const user = await getUserByUid(uid);
  if (!user) {
    return { error: "user not found", status: 404 };
  }
  // いいねの削除
  const { error: favoriteError } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id);
  if (favoriteError) {
    return { error: favoriteError, status: 500 };
  }

  // 投稿に紐づいたいいね削除
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", user.id);
  if (postsError) {
    return { error: postsError, status: 500 };
  }
  const { error: favoriteError2 } = await supabase
    .from("favorites")
    .delete()
    .in(
      "post_id",
      posts.map((post: any) => post.id)
    );
  if (favoriteError2) {
    return { error: favoriteError2, status: 500 };
  }

  // 投稿に紐づいたタグの削除
  const { error: tagError } = await supabase
    .from("post_tags")
    .delete()
    .in(
      "post_id",
      posts.map((post: any) => post.id)
    );
  if (tagError) {
    return { error: tagError, status: 500 };
  }

  // 投稿削除
  const { error: postError } = await supabase
    .from("posts")
    .delete()
    .eq("user_id", user.id);
  if (postError) {
    return { error: postError, status: 500 };
  }

  // ユーザーの削除
  const { error } = await supabase.from("users").delete().eq("id", user.id);
  if (error) {
    return { error, status: 500 };
  }

  return { status: 200 };
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
    let posts: PostData[] = [];
    posts = await Promise.all(
      data.map(async (post) => {
        const { data: tags, error: tagError } = await supabase
          .from("post_tags")
          .select("tag_id(*)")
          .eq("post_id", post.id);
        if (tagError) {
          return { error, status: 500 };
        }

        const postTags = [] as { id: number; name: string }[];
        tags.forEach((tag: any) => {
          postTags.push({ id: tag.tag_id.id, name: tag.tag_id.name });
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

export async function getPostsByUser(uid: string, range: [number, number]) {
  try {
    const user = await getUserByUid(uid);

    if (!user || "id" in user === false) {
      return { error: "user not found", status: 404 };
    }
    const { data, error } = await supabase
      .from("posts")
      .select(`*,user_id: user_id(*)`)
      .eq("user_id", user.id)
      .range(range[0], range[1])
      .order("created_at", { ascending: false });
    if (error) {
      return { error, status: 500 };
    }

    // 各データのタグを取得
    let posts: PostData[] = [];
    posts = await Promise.all(
      data.map(async (post) => {
        const { data: tags, error: tagError } = await supabase
          .from("post_tags")
          .select("tag_id(*)")
          .eq("post_id", post.id);
        if (tagError) {
          return { error, status: 500 };
        }

        const postTags = [] as { id: number; name: string }[];
        tags.forEach((tag: any) => {
          postTags.push({ id: tag.tag_id.id, name: tag.tag_id.name });
        });
        return { ...post, tags: postTags };
      })
    );

    const { data: countData, error: countError } = await supabase
      .from("posts")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);
    if (countError) {
      return { error, status: 500 };
    }

    return { posts, count: countData.length };
  } catch (error: any) {
    return { error, status: 500 };
  }
}

export async function getPostsByFavorite(
  userId: number,
  range: [number, number]
) {
  // お気に入りテーブルからpostを取得
  const { data, error } = await supabase
    .from("favorites")
    .select("post_id(*)")
    .eq("user_id", userId)
    .range(range[0], range[1])
    .order("id", { ascending: false });
  if (error) {
    return { error, status: 500 };
  }
  console.log(data);

  // 各データのタグを取得
  let posts: PostData[] = [];
  posts = await Promise.all(
    data.map(async (post: any) => {
      const { data: tags, error: tagError } = await supabase
        .from("post_tags")
        .select("tag_id(*)")
        .eq("post_id", post.post_id.id);
      if (tagError) {
        return { error, status: 500 };
      }

      const postTags = [] as { id: number; name: string }[];
      tags.forEach((tag: any) => {
        postTags.push({ id: tag.tag_id.id, name: tag.tag_id.name });
      });
      return { ...post.post_id, tags: postTags };
    })
  );

  const { data: countData, error: countError } = await supabase
    .from("favorites")
    .select("id", { count: "exact" })
    .eq("user_id", userId);
  if (countError) {
    return { error, status: 500 };
  }

  return { posts, count: countData.length };
}

export async function getPost(uid: string, userUid: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`*,user_id: user_id(*)`)
    .eq("uuid", uid)
    .single();
  if (error) {
    return { error, status: 500 };
  }

  const { data: post_tags, error: tagError } = await supabase
    .from("post_tags")
    .select("tag_id(*)")
    .eq("post_id", data.id);
  if (tagError) {
    return { error, status: 500 };
  }

  const tags = [] as { id: number; name: string }[];
  post_tags.forEach((tag: any) => {
    tags.push({ id: tag.tag_id.id, name: tag.tag_id.name });
  });

  let isFavorite = false;
  if (userUid !== "") {
    const user = await getUserByUid(userUid);
    if (!user || "id" in user === false) {
      return { error: "user not found", status: 404 };
    }

    const { data: favorite, error: favoriteError } = await supabase
      .from("favorites")
      .select()
      .eq("post_id", data.id)
      .eq("user_id", user.id);
    if (favoriteError) {
      return { error: favoriteError, status: 500 };
    }
    isFavorite = favorite.length > 0 ? true : false;
  }

  return { post: { ...data, tags, isFavorite }, status: 200 };
}

export async function deletePost(id: number) {
  const { error: tagError } = await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", id);
  if (tagError) {
    return { error: tagError, status: 500 };
  }

  const { error: favoriteError } = await supabase
    .from("favorites")
    .delete()
    .eq("post_id", id);
  if (favoriteError) {
    return { error: favoriteError, status: 500 };
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.log(error);
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

  return data;
}

export async function getFavorite(postId: number, userId: number) {
  const { data, error } = await supabase
    .from("favorites")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId);
  if (error) {
    return { error, status: 500 };
  }

  return { data, status: 200 };
}

export async function postFavorite(postId: number, userUid: string) {
  const user = await getUserByUid(userUid);
  if (user === null) {
    return { error: "user not found", status: 404 };
  }
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ post_id: postId, user_id: user.id }])
    .select();
  if (error) {
    return { error, status: 500 };
  }

  return { data, status: 200 };
}

export async function deleteFavorite(postId: number, userUid: string) {
  const user = await getUserByUid(userUid);
  if (user === null) {
    return { error: "user not found", status: 404 };
  }
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id);
  if (error) {
    return { error, status: 500 };
  }

  return { status: 200 };
}
