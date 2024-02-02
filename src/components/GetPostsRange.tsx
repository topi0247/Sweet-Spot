import {
  getPosts,
  getPostsByFavorite,
  getPostsByUser,
} from "@/utils/supabaseClient";

const postsAmount = 15;

export const getPostsRange = async (currentPage: number) => {
  const { start, end } = page(currentPage);
  const fetchedPosts = await getPosts([start, end]);

  if (fetchedPosts && fetchedPosts.posts) {
    const newPosts = fetchedPosts.posts;
    const pageTabsCount = Math.ceil(fetchedPosts.count / postsAmount);
    return { newPosts, pageTabsCount };
  }
};

export const getPostsRangeByUser = async (currentPage: number, uid: string) => {
  const { start, end } = page(currentPage);
  const fetchedPosts = await getPostsByUser(uid, [start, end]);
  if (fetchedPosts && fetchedPosts.posts) {
    const posts = fetchedPosts.posts;
    const pageTabsCount = Math.ceil(fetchedPosts.count / postsAmount);
    return { posts, pageTabsCount };
  }
};

export const getPostsRangeByFavorite = async (
  currentPage: number,
  user_id: number
) => {
  const { start, end } = page(currentPage);
  const fetchedPosts = await getPostsByFavorite(user_id, [start, end]);
  if (fetchedPosts && fetchedPosts.posts) {
    const posts = fetchedPosts.posts;
    const pageTabsCount = Math.ceil(fetchedPosts.count / postsAmount);
    return { posts, pageTabsCount };
  }
};

const page = (currentPage: number) => {
  const page = currentPage - 1;
  const start = page * postsAmount;
  const end = page * postsAmount + (postsAmount - 1);
  return { start, end };
};
