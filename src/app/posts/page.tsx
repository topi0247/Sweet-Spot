"use client";

import PostCard from "@/components/postCard";
import { Post } from "@/types";
import { getPosts } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([] as Post[]);
  const [page, setPage] = useState(0);
  const postsAmount = 20;

  useEffect(() => {
    const fetchData = async () => {
      await getPostsLimit();
    };
    fetchData();
  }, []);

  const getPostsLimit = async () => {
    const start = page * postsAmount;
    const end = page * postsAmount + (postsAmount - 1);
    const fetchedPosts = await getPosts([start, end]);
    if (fetchedPosts) {
      setPosts([]);
      const newPosts = fetchedPosts.map((post) => ({
        id: post.id,
        uuid: post.uuid,
        comment: post.comment,
        url: post.url,
        user_id: { displayName: post.user_id.displayName },
        created_at: post.created_at,
      }));
      console.log(newPosts);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }
  };

  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      {posts.length === 0 ? (
        <p className="block text-center">投稿はありません</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </article>
  );
};

export default Posts;
