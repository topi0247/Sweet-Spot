"use client";

import React, { useEffect, useState } from "react";
import RoutesPath from "@/common/routerPath";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { getUserByEmail, postPost } from "@/utils/supabaseClient";

type User = {
  id: number;
  uuid: string;
  displayName: string;
};

const NewPost = () => {
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState({} as User);
  const router = useRouter();

  const checkAuth = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      const result = await getUserByEmail(auth.currentUser.email);
      if (result) {
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
        if (result) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    postPost(url, comment, user.id).then((result) => {
      router.push(RoutesPath.Posts);
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <section className="w-full mx-auto">
      <h2 className="text-center text-2xl">投稿する</h2>
      <div className="bg-orange-200 p-4 w-96 mx-auto my-5">
        <form className="flex  flex-col gap-5" onSubmit={handleSubmit}>
          <label>
            URL
            <input
              type="url"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleUrlChange}
            />
          </label>
          <label>
            コメント
            <input
              type="text"
              className="w-full bg-white focus:outline-none p-2"
              onChange={handleCommentChange}
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
