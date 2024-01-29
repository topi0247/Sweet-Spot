"use client";

import React, { useEffect, useState } from "react";
import RoutesPath from "@/common/routerPath";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { getUserByEmail, postPost } from "@/utils/supabaseClient";
import "../../../ui/radio.css";
import { getOGP } from "@/common/getOgp";
import Ogp from "@/components/ogp";
import { set } from "firebase/database";

type User = {
  id: number;
  uuid: string;
  displayName: string;
};

const NewPost = () => {
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [moreComment, setMoreComment] = useState("");
  const [user, setUser] = useState({} as User);
  const [genre, setGenre] = useState("" as string);
  const [existUrl, setExitsUrl] = useState(false);
  const [title, setTitle] = useState("" as string);
  const [image, setImage] = useState("" as string);
  const [tags, setTags] = useState([] as string[]);
  const router = useRouter();

  const checkAuth = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      const result = await getUserByEmail(auth.currentUser.email);
      if (result && "id" in result) {
        setUser({
          id: result.id,
          uuid: result.uuid,
          displayName: result.displayName,
        });
      }
    } else {
      router.push(RoutesPath.Login);
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
            uuid: result.uuid,
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
        setImage(result.image);
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
    if (!url) {
      return;
    }

    postPost(url, comment, user.id, genre, tags, moreComment).then((result) => {
      router.push(RoutesPath.Posts);
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
    setTags(e.target.value.split(/\s|　/));
  };

  return (
    <section className="w-full mx-auto">
      <h2 className="text-center text-2xl">投稿する</h2>
      <div className="bg-orange-200 p-4 w-96 mx-auto my-5">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <p>*は必須項目です</p>
          <label>
            URL*
            <input
              type="url"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleUrlChange}
            />
          </label>
          {title && image && (
            <>
              <p>{title}</p>
              <Ogp image={image} title={title} />
            </>
          )}
          <label>
            コメント
            <input
              type="text"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleCommentChange}
            />
            {commentLengthView()}
          </label>
          <label>
            もっと書く
            <textarea
              className="w-full bg-white focus:outline-none p-2 h-48 overflow-y-hidden"
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
                className="inline-flex text-white bg-orange-400 border-0 py-1 px-4 focus:outline-none hover:bg-orange-600 rounded cursor-pointer"
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
                className="inline-flex text-white bg-orange-400 border-0 py-1 px-4 focus:outline-none hover:bg-orange-600 rounded cursor-pointer"
              >
                商品
              </label>
            </div>
          </div>
          <label>
            タグ
            <input
              type="text"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleTags}
              placeholder="スペースで区切ってください"
            />
          </label>
          <button className="btn btn-sm bg-orange-100 hover:bg-orange-800 border-none text-orange-950 hover:text-orange-100 rounded-none">
            投稿
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewPost;
