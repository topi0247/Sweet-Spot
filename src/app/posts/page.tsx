"use client";

import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { PostData } from "@/types";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { getPostsRange } from "@/components/GetPostsRange";

const Posts = () => {
  const [posts, setPosts] = useState([] as PostData[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const isMobile = window.innerWidth <= 768;
  const isTablet = 769 < window.innerWidth && window.innerWidth < 1024;
  const isPc = 1024 <= window.innerWidth;

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

  const page = () => {
    let className = "";
    if (isMobile) className = "flex flex-col gap-4";
    else if (isTablet) className = "grid grid-cols-2 gap-4";
    else if (isPc) className = "grid grid-cols-3 gap-4";

    return (
      <>
        <div className={className}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </>
    );
  };

  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      {posts.length === 0 ? <Loading /> : page()}
      <Pagination
        pageNumber={currentPage}
        totalCount={pageTabsCount}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};

export default Posts;
