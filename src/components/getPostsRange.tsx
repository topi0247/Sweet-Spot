import { getPosts, getPostsByUser } from "@/utils/supabaseClient";

const postsAmount = 20;

export const getPostsRange = async (currentPage: number) => {
  const page = currentPage - 1;
  const start = page * postsAmount;
  const end = page * postsAmount + (postsAmount - 1);
  const fetchedPosts = await getPosts([start, end]);

  if (fetchedPosts && fetchedPosts.posts) {
    const newPosts = fetchedPosts.posts;
    const pageTabsCount = Math.ceil(fetchedPosts.count / postsAmount);
    return { newPosts, pageTabsCount };
  }
};

export const getPostsRangeByUser = async (currentPage: number, uid: string) => {
  const page = currentPage - 1;
  const start = page * postsAmount;
  const end = page * postsAmount + (postsAmount - 1);
  const fetchedPosts = await getPostsByUser(uid, [start, end]);
  if (fetchedPosts && fetchedPosts.posts) {
    const newPosts = fetchedPosts.posts;
    const pageTabsCount = Math.ceil(fetchedPosts.count / postsAmount);
    return { newPosts, pageTabsCount };
  }
};
