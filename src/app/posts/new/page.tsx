"use client";

import React, { useEffect, useState } from "react";
import RoutePath from "@/common/RouterPath";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { getUserByEmail, postPost } from "@/utils/supabaseClient";
import "../../../ui/Radio.css";
import { getOGP } from "@/common/GetOgp";
import Ogp from "@/components/Ogp";
import { UserData } from "@/types";
import Button from "@/ui/Button";

const NewPost = () => {
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [moreComment, setMoreComment] = useState("");
  const [user, setUser] = useState({} as UserData);
  const [genre, setGenre] = useState("" as string);
  const [existUrl, setExitsUrl] = useState(false);
  const [title, setTitle] = useState("" as string);
  const [image, setImage] = useState("" as string);
  const [notImage, setNotImage] = useState(false);
  const [tags, setTags] = useState([] as string[]);
  const router = useRouter();

  const checkAuth = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      const result = await getUserByEmail(auth.currentUser.email);
      if (result && "id" in result) {
        setUser({
          id: result.id,
          uid: result.uid,
          displayName: result.displayName,
        });
      }
    } else {
      router.push(RoutePath.Login);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const getUser = async () => {
    if (auth.currentUser?.email) {
      await getUserByEmail(auth.currentUser.email).then((result) => {
        if (result && "id" in result) {
          setUser({
            id: result.id,
            uid: result.uid,
            displayName: result.displayName,
          });
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUser();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (existUrl) {
      const getMetadata = async () => {
        const result = await getOGP(url);
        setTitle(result.title);
        if (result.image === "") {
          setNotImage(true);
          setImage("/Sweet Spot!.png");
        } else {
          setImage(result.image);
        }
      };
      getMetadata();
    } else {
      setTitle("");
      setImage("");
      setUrl("");
    }
  }, [existUrl]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidURL(url) || tags.length > 3 || comment.length > 10) {
      return;
    }

    postPost(url, comment, user.id, genre, tags, moreComment).then((result) => {
      router.push(RoutePath.Posts);
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidURL(e.target.value)) {
      setUrl(e.target.value);
      setExitsUrl(true);
    } else {
      setExitsUrl(false);
    }
  };

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
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

  return (
    <section className="w-full mx-auto">
      <h2 className="text-center text-2xl">投稿する</h2>
      <div className="bg-orange-100 p-4 w-5/6 mx-auto my-5 rounded-2xl">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <p>*は必須項目です</p>
          <label>
            URL*
            <input
              type="url"
              className="w-full rounded-2xl bg-white focus:outline-none p-2"
              onChange={handleUrlChange}
            />
          </label>
          {title && (
            <p className="border-solid border-b-2 border-orange-950">{title}</p>
          )}
          {notImage && (
            <p>
              画像がありませんでした。
              <br />
              デフォルト画像で投稿できます。
            </p>
          )}
          {image && <Ogp image={image} title={title} />}
          <label>
            コメント
            <input
              type="text"
              className="w-full rounded-2xl bg-white focus:outline-none p-2"
              onChange={handleCommentChange}
            />
            {commentLengthView()}
          </label>
          <label>
            もっと書く
            <textarea
              className="w-full rounded-2xl bg-white focus:outline-none p-2 h-48 overflow-y-hidden"
              onChange={handleMoreComment}
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
            />
            {tagsLengthView()}
          </label>
          <Button content="投稿" onClickEvent={null} />
        </form>
      </div>
    </section>
  );
};

export default NewPost;
