"use client";

import Loading from "@/app/loading";
import { getOGP } from "@/common/getOgp";
import { OgpData, PostData } from "@/types";
import { auth } from "@/utils/firebase";
import { deletePost, getPost } from "@/utils/supabaseClient";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Post = ({ params }: { params: { uuid: string } }) => {
  const [post, setPost] = useState({} as PostData);
  const [ogp, setOgp] = useState({} as OgpData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      await getPostData();
    };

    fetchData();
  }, []);

  const getPostData = async () => {
    const postData = await getPost(params.uuid);
    if (postData) {
      console.log(postData);
      setPost(postData.post);
      const ogpData = await getOGP(postData.post.url);
      setOgp(ogpData);
    }
    setLoading(false);
  };

  const handleEdit = () => {};

  const handleDelete = async () => {
    const res = window.confirm("削除しますか？");
    if (res) {
      const res = await deletePost(post.id);
      if (res.status === 200) {
        alert("削除しました");
        router.back();
      } else {
        alert("削除に失敗しました");
      }
    }
  };

  const showEditDeleteButton = () => {
    if (auth.currentUser?.uid === post.user_id.uid) {
      return (
        <div className="flex gap-2">
          <button
            className="border-slate-900 border-solid border-2 px-2 rounded"
            onClick={handleEdit}
          >
            編集
          </button>
          <button
            className="border-slate-900 border-solid border-2 px-2 rounded"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <article className="m-auto">
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt={ogp.title}
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={ogp.image}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {post.tags
                  ? post.tags.length > 1
                    ? post.tags.join(" ")
                    : post.tags
                  : ""}
              </h2>
              <h2 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {ogp.title}
              </h2>
              <p>
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                {post.user_id?.displayName}
              </p>
              <p className="leading-relaxed mt-2">
                {post.comment ? post.comment : ""}
                <br />
                {post.more_comment ? post.more_comment : ""}
              </p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-orange-900 mb-5"></div>
              <div className="flex justify-between">
                {showEditDeleteButton()}
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex ml-auto text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-orange-600 rounded"
                >
                  詳細を見に行く
                </Link>
                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="btn bg-orange-300 border-none text-black hover:bg-orange-400"
          >
            一覧へ戻る
          </button>
        </div>
      </section>
    </article>
  );
};
export default Post;
