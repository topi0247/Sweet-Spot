"use client";

import Pagination from "@/components/pagination";
import PostCard from "@/components/postCard";
import { PostData } from "@/types";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { getPostsRange } from "@/components/getPostsRange";

const Posts = () => {
  const [posts, setPosts] = useState([] as PostData[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const postsAmount = 20;

  // 初期
  useEffect(() => {
    const fetchData = async () => {
      const result = await getPostsRange(currentPage);
      if (result) {
        setPosts(result.newPosts);
        setPageTabsCount(result.pageTabsCount);
      }
    };
    fetchData();
  }, []);

  // ページ遷移
  useEffect(() => {
    const fetchData = async () => {
      const result = await getPostsRange(currentPage);
      if (result) {
        setPosts(result.newPosts);
        setPageTabsCount(result.pageTabsCount);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      {posts.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-3 gap-4">
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
