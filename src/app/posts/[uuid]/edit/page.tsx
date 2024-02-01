"use client";

import React, { useEffect, useState } from "react";
import RoutesPath from "@/common/RouterPath";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { getOGP } from "@/common/GetOgp";
import Ogp from "@/components/Ogp";
import { OgpData, PostData, UserData } from "@/types";
import Button from "@/ui/Button";
import { getPost, getUserByUid } from "@/utils/supabaseClient";

const Edit = ({ params }: { params: { uuid: string } }) => {
  const [comment, setComment] = useState("");
  const [moreComment, setMoreComment] = useState("");
  const [user, setUser] = useState({} as UserData);
  const [genre, setGenre] = useState("" as string);
  const [notImage, setNotImage] = useState(false);
  const [tags, setTags] = useState([] as string[]);
  const [post, setPost] = useState({} as PostData);
  const [ogp, setOgp] = useState({} as OgpData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    if (auth.currentUser && auth.currentUser.uid) {
      const result = await getUserByUid(auth.currentUser.uid);

      if (result && "id" in result) {
        setUser({
          id: result.id,
          uid: result.uid,
          displayName: result.displayName,
        });
      }
    } else {
      router.push(RoutesPath.Login);
    }
  };

  const getPostData = async () => {
    const postData = await getPost(params.uuid, "");
    if (postData.status === 200) {
      setPost(postData.post);
      let ogpData = await getOGP(postData.post.url);
      if (!ogpData.image) {
        setNotImage(true);
        ogpData.image = "/Sweet Spot!.png";
      }
      setOgp(ogpData);
      setComment(postData.post.comment);
      setMoreComment(postData.post.more_comment);
      setGenre(postData.post.genre);
      setTags(
        postData.post.tags.map((tag: { id: number; name: string }) => tag.name)
      );
    } else {
      alert("編集権限がありません");
      router.push(RoutesPath.MyPage);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      await getPostData();
    };

    return () => {
      fetchData();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleMoreComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMoreComment(e.target.value);
  };

  const commentLengthView = () => {
    if (comment.length <= 10) {
      return <p className="text-sm text-end">{comment.length}/10文字</p>;
    } else {
      return (
        <p className="text-sm text-red-600 text-end">{comment.length}/10文字</p>
      );
    }
  };

  const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(/\s|　/).filter((tag) => tag !== "");
    setTags(tags);
  };

  const tagsLengthView = () => {
    if (tags.length <= 3) {
      return <p className="text-sm text-end">{tags.length}/3つ</p>;
    } else {
      return <p className="text-sm text-red-600 text-end">{tags.length}/3つ</p>;
    }
  };

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <section className="w-full mx-auto">
      <h2 className="text-center text-2xl">編集する</h2>
      <div className="bg-orange-100 p-4 w-5/6 mx-auto my-5 rounded-2xl">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <p>
            URL
            <span className="bg-orange-200 p-2 rounded-2xl ml-2">
              {post.url}
            </span>
          </p>
          {ogp.title && (
            <p className="border-solid border-b-2 border-orange-950">
              {ogp.title}
            </p>
          )}
          {notImage && (
            <p>
              画像がありませんでした。
              <br />
              デフォルト画像で投稿できます。
            </p>
          )}
          <div className="w-96 mx-auto max-w-full">
            {ogp.image && <Ogp image={ogp.image} title={ogp.image} />}
          </div>
          <label>
            コメント
            <input
              type="text"
              className="w-full rounded-2xl bg-white focus:outline-none p-2"
              onChange={handleCommentChange}
              value={comment}
            />
            {commentLengthView()}
          </label>
          <label>
            もっと書く
            <textarea
              className="w-full rounded-2xl bg-white focus:outline-none p-2 h-48 overflow-y-hidden"
              onChange={handleMoreComment}
              value={moreComment}
            ></textarea>
          </label>
          <div>
            紹介ジャンル
            <div className="flex gap-2">
              <input
                type="radio"
                name="genre"
                className="hidden"
                id="store"
                value="store"
                onChange={(e) => setGenre(e.target.value)}
              />
              <label
                htmlFor="store"
                className="inline-flex text-white bg-orange-300 border-0 py-1 px-4 focus:outline-none hover:bg-orange-600 rounded-2xl cursor-pointer transition-all"
              >
                お店
              </label>

              <input
                type="radio"
                name="genre"
                className="hidden"
                id="item"
                value="item"
                onChange={(e) => setGenre(e.target.value)}
              />
              <label
                htmlFor="item"
                className="inline-flex text-white bg-orange-300 border-0 py-1 px-4 focus:outline-none hover:bg-orange-600 rounded-2xl cursor-pointer transition-all"
              >
                商品
              </label>
            </div>
          </div>
          <label>
            タグ
            <p className="text-xs text-gray-600">スペースで区切ってください</p>
            <p className="text-xs text-gray-600">3つまで設定できます</p>
            <input
              type="text"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleTags}
              placeholder="チョコ　期間限定　甘さ控えめ"
              value={tags.join(" ")}
            />
            {tagsLengthView()}
          </label>
          <Button content="投稿" onClickEvent={null} />
        </form>
      </div>
    </section>
  );
};

export default Edit;
