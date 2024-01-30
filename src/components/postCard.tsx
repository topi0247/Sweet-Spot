"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { OgpData, PostData } from "@/types";
import { getOGP } from "@/common/getOgp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Loading from "@/app/loading";
import Ogp from "./ogp";
import { useRouter } from "next/navigation";

type PostCardProps = {
  post: PostData;
};
const PostCard = ({ post }: PostCardProps) => {
  const [ogp, setOgp] = useState({} as OgpData);
  const { id, uuid, comment, url, user_id, created_at, genre, tags } = post;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  console.log(tags);

  return (
    <section
      className="text-orange-900 body-font w-full"
      style={{ height: 430 }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="h-full bg-orange-100 shadow-xl rounded-2xl hover:translate-y-2 hover:shadow-none transition-all">
          <Ogp image={ogp.image} title={ogp.title} />
          <div className="p-5 flex flex-col">
            <div>
              <h3>
                <span className="line-clamp-2">{ogp.title}</span>
              </h3>
              <hr className="border-orange-900 my-2" />
            </div>
            <div className="flex flex-wrap text-xs gap-1 justify-start items-center">
              {tags.map((tag) => (
                <p
                  key={tag.id}
                  className="border-solid border-green-500 border-2 px-2 rounded-lg text-green-500"
                >
                  {tag.name}
                </p>
              ))}
            </div>
            <div className="grid mt-2 items-center">
              <div className="text-sm">
                <p>
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {user_id.displayName}
                </p>
                <p className="line-clamp-1">{comment}</p>
                <Link
                  href={`/posts/${uuid}`}
                  className="text-sky-500 block text-end"
                >
                  詳細
                </Link>
              </div>
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
