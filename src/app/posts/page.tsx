"use client";

import Pagination from "@/components/pagination";
import PostCard from "@/components/postCard";
import { Post } from "@/types";
import { getPosts } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";
import Loading from "../loading";

const Posts = () => {
  const [posts, setPosts] = useState([] as Post[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const postsAmount = 20;

  // 初期
  useEffect(() => {
    const fetchData = async () => {
      await getPostsLimit();
    };
    fetchData();
  }, []);

  // ページ遷移
  useEffect(() => {
    const fetchData = async () => {
      await getPostsLimit();
    };
    fetchData();
  }, [currentPage]);

  const getPostsLimit = async () => {
    const page = currentPage - 1;
    const start = page * postsAmount;
    const end = page * postsAmount + (postsAmount - 1);
    const fetchedPosts = await getPosts([start, end]);
    if (fetchedPosts) {
      setPosts([]);
      const newPosts = fetchedPosts.data.map((post) => ({
        id: post.id,
        uuid: post.uuid,
        comment: post.comment,
        url: post.url,
        user_id: { displayName: post.user_id.displayName },
        created_at: post.created_at,
        genre: post.genre,
      }));
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setTotalCount(fetchedPosts.count);
      setPageTabsCount(Math.ceil(fetchedPosts.count / postsAmount));
    }
  };

  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      {posts.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      <Pagination
        pageNumber={currentPage}
        totalCount={pageTabsCount}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};

export default Posts;
