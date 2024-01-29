"use client";

import Loading from "@/app/loading";
import { getPostsRangeByUser } from "@/components/getPostsRange";
import Pagination from "@/components/pagination";
import PostCard from "@/components/postCard";
import { PostData, UserData } from "@/types";
import { getUserByUid } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";

const MyPage = ({ params }: { params: { uid: string } }) => {
  const { uid } = params;
  const [user, setUser] = useState({} as UserData);
  const [posts, setPosts] = useState([] as PostData[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const decodedUid = decodeURIComponent(uid);
      const userData = await getUserByUid(decodedUid);
      if (userData) {
        setUser(userData);
        setLoading(false);
      }
      const result = await getPostsRangeByUser(1, decodedUid);
      if (result) {
        setPosts(result.newPosts);
        setPageTabsCount(result.pageTabsCount);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const decodedUid = decodeURIComponent(uid);
      const result = await getPostsRangeByUser(currentPage, decodedUid);
      if (result) {
        setPosts(result.newPosts);
        setPageTabsCount(result.pageTabsCount);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <article>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h2 className="text-center text-2xl m-5">
            {user.displayName}さんのページ
          </h2>
          <div>
            <h3 className="m-3 text-xl">投稿一覧</h3>
            <div className="grid grid-cols-4 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </>
      )}
      <Pagination
        pageNumber={currentPage}
        totalCount={pageTabsCount}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};

export default MyPage;
