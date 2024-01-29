"use client";

import Pagination from "@/components/pagination";
import PostCard from "@/components/postCard";
import { PostData } from "@/types";
import { getPosts } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";
import Loading from "../loading";

const Posts = () => {
  const [posts, setPosts] = useState([] as PostData[]);
  const [currentPage, setCurrentPage] = useState(1);
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

    if (fetchedPosts && fetchedPosts.posts) {
      setPosts([]);
      const newPosts = fetchedPosts.posts;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
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
