"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { getOGP } from "@/common/getOgp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Loading from "@/app/loading";
import Ogp from "./ogp";

type PostCardProps = {
  post: Post;
};

type OgpData = {
  title: string;
  image: string;
};

const PostCard = ({ post }: PostCardProps) => {
  const [ogp, setOgp] = useState({} as OgpData);
  const { id, uuid, comment, url, user_id, created_at, genre } = post;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getMetadata = async () => {
      const result = await getOGP(url);
      setOgp(result);
      setLoading(false);
    };

    getMetadata();
  }, []);

  const setGenreTag = () => {
    if (genre === "store")
      return (
        <p className="border-solid border-sky-500 border-2 px-2 rounded-lg text-sky-500">
          お店
        </p>
      );
    else if (genre === "item")
      return (
        <p className="border-solid border-orange-500 border-2 px-2 rounded-lg text-orange-500">
          商品
        </p>
      );
    else
      return (
        <p className="border-solid border-slate-500 border-2 px-2 rounded-lg text-slate-500">
          未設定
        </p>
      );
  };

  return (
    <section
      className="text-orange-900 body-font w-full"
      style={{ height: 360 }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="h-full bg-orange-200 shadow-xl rounded-none hover:translate-y-2 hover:shadow-none transition-all">
          <Ogp image={ogp.image} title={ogp.title} />
          <div className="p-5 h-2/4 grid">
            <h3>
              <Link
                href={url}
                className="line-clamp-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ogp.title}
              </Link>
            </h3>
            <div className="flex flex-col gap-1 mt-2">
              <hr className="border-orange-900" />
              <p className="text-sm">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                {user_id.displayName}
              </p>
              {comment.length > 0 ? (
                <div className="text-sm">
                  <p className="line-clamp-1">{comment}</p>
                  <Link
                    href={`/posts/${post.uuid}`}
                    className="text-sky-500 block text-end"
                  >
                    続きを読む
                  </Link>
                </div>
              ) : (
                <p className="p-2"></p>
              )}
              <div className="text-xs text-end flex justify-end gap-2 items-center">
                {setGenreTag()}
                <p>投稿日 {new Date(created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostCard;
