"use client";

import Loading from "@/app/loading";
import {
  getPostsRangeByFavorite,
  getPostsRangeByUser,
} from "@/components/GetPostsRange";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { PostData, UserData } from "@/types";
import { getUserByUid, deleteUserByUid } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/ui/Button";
import RoutesPath from "@/common/RouterPath";
import { auth } from "@/utils/firebase";
import { deleteUser } from "firebase/auth";

const MyPage = ({ params }: { params: { uid: string } }) => {
  const searchParams = useSearchParams();
  const { uid } = params;
  const [user, setUser] = useState({} as UserData);
  const [posts, setPosts] = useState([] as PostData[]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams?.get("page")) || 1
  );
  const [pageTabsCount, setPageTabsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isResponsiveClass, setIsResponsiveClass] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (uid === "undefined") {
      alert(
        "アカウント作成に失敗している可能性があります。\nお手数おかけしますがもう一度作成してみてください。\n同一アカウントであればデータは引き継がれます。"
      );
      router.push(RoutesPath.Signin);
    } else {
      const fetchData = async () => {
        const userData = await getUserByUid(uid);
        if (userData) {
          setUser(userData);
          setLoading(false);
        } else {
          alert("アカウントが見つかりませんでした。");
          router.push(RoutesPath.Posts);
        }
        const result = await getPostsRangeByUser(1, uid);
        if (result) {
          setPosts(result.posts);
          setPageTabsCount(result.pageTabsCount);
        }
      };
      fetchData();
      if (window.innerWidth <= 768) setIsResponsiveClass("flex flex-col gap-4");
      else if (769 < window.innerWidth && window.innerWidth < 1024)
        setIsResponsiveClass("grid grid-cols-2 gap-4");
      else if (1024 <= window.innerWidth)
        setIsResponsiveClass("grid grid-cols-3 gap-4");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (isFavorite) {
        const result = await getPostsRangeByFavorite(currentPage, user.id);
        if (result) {
          setPosts(result.posts);
          setPageTabsCount(result.pageTabsCount);
          setLoading(false);
        }
      } else {
        await defaultSetPosts();
      }
    };
    fetchData();
  }, [currentPage, isFavorite]);

  const defaultSetPosts = async () => {
    const decodedUid = decodeURIComponent(uid);
    const result = await getPostsRangeByUser(currentPage, decodedUid);
    if (result) {
      setPosts(result.posts);
      setPageTabsCount(result.pageTabsCount);
      setLoading(false);
    }
    return result;
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    setLoading(true);
  };

  const onClickDeleteUser = async () => {
    if (!auth.currentUser) return;
    const res = confirm("本当にアカウントを削除しますか？");
    console.log(res);
    if (res.valueOf() === true) {
      const result = await deleteUserByUid(uid);
      if (result.status === 200) {
        deleteUser(auth.currentUser).then(() => {
          alert("アカウントを削除しました。");
          router.push(RoutesPath.Posts);
        });
      } else {
        console.log(result);
        alert("アカウントの削除に失敗しました。");
      }
    }
  };

  return (
    <article>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h2 className="text-center text-2xl m-5">
            {user.displayName}さんのページ
          </h2>
          {auth.currentUser?.uid === uid && (
            <div className="text-end">
              <Button
                content="表示名を変更する"
                onClickEvent={() => {
                  router.push(`/users/${uid}/edit`);
                }}
              />
              <button
                className=" m-3 bg-red-500 p-2 rounded-2xl text-white"
                onClick={() => onClickDeleteUser()}
              >
                アカウントを削除する
              </button>
            </div>
          )}
          <div>
            <div className="flex">
              {isFavorite ? (
                <>
                  <button
                    className="m-3 text-xl  p-2 rounded-2xl hover:bg-slate-200 transition-all"
                    onClick={() => handleFavorite()}
                  >
                    投稿一覧
                  </button>
                  <button
                    className="m-3 text-xl rounded-2xl p-2 bg-slate-200"
                    onClick={() => handleFavorite()}
                  >
                    いいね一覧
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="m-3 text-xl bg-slate-200 p-2 rounded-2xl"
                    onClick={() => handleFavorite()}
                  >
                    投稿一覧
                  </button>
                  <button
                    className="m-3 text-xl rounded-2xl p-2 hover:bg-slate-200 transition-all"
                    onClick={() => handleFavorite()}
                  >
                    いいね一覧
                  </button>
                </>
              )}
            </div>
            <div className={isResponsiveClass}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          <Pagination
            pageNumber={currentPage}
            totalCount={pageTabsCount}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </article>
  );
};

export default MyPage;
