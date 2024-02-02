"use client";

import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { PostData, UserData } from "@/types";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { getPostsRange } from "@/components/GetPostsRange";
import { getUserByUid, updateUser } from "@/utils/supabaseClient";
import { auth } from "@/utils/firebase";
import Modal from "@/components/Modal";

const Posts = () => {
  const [posts, setPosts] = useState([] as PostData[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPc, setIsPc] = useState(false);
  const [isDisplayName, setIsDisplayName] = useState(true);
  const [user, setUser] = useState({} as UserData);
  const [displayName, setDisplayName] = useState("");

  // 初期
  useEffect(() => {
    const fetchData = async () => {
      const result = await getPostsRange(currentPage);
      if (result) {
        setPosts(result.newPosts);
        setPageTabsCount(result.pageTabsCount);
      }
      if (auth.currentUser?.uid) {
        const user = await getUserByUid(auth.currentUser?.uid);
        if (user) {
          setUser(user);

          if (!user.displayName) {
            setIsDisplayName(false);
          }
        }
      }
    };
    fetchData();
    setIsMobile(window.innerWidth <= 768);
    setIsTablet(769 < window.innerWidth && window.innerWidth < 1024);
    setIsPc(1024 <= window.innerWidth);
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

  const modalOnSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await updateUser(user.id, displayName);
    if (result.status === 200) {
      alert("表示名を変更しました");
      setIsDisplayName(true);
    }
  };

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
    <>
      {!isDisplayName && (
        <Modal
          onSubmitEvent={modalOnSubmitEvent}
          setDisplayName={setDisplayName}
        />
      )}
      <article>
        <h2 className="text-center text-2xl m-5">投稿一覧</h2>
        {posts.length === 0 ? <Loading /> : page()}
        <Pagination
          pageNumber={currentPage}
          totalCount={pageTabsCount}
          setCurrentPage={setCurrentPage}
        />
      </article>
    </>
  );
};

export default Posts;
