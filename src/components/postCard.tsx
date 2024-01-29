"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { getOGP } from "@/common/getOgp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Loading from "@/app/loading";

type PostCardProps = {
  post: Post;
};

type OgpData = {
  title: string;
  image: string;
};

const PostCard = ({ post }: PostCardProps) => {
  const [ogp, setOgp] = useState({} as OgpData);
  const { id, uuid, comment, url, user_id, created_at } = post;
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

  return (
    <section className="text-orange-900 body-font w-full h-68">
      {loading ? (
        <Loading />
      ) : (
        <div className="h-full bg-orange-200 shadow-xl rounded-none hover:translate-y-2 hover:shadow-none transition-all">
          <figure className="h-2/4 bg-white">
            <img
              src={ogp.image}
              alt={ogp.title}
              className="w-full h-full object-contain"
            />
          </figure>
          <div className="p-5 h-2/4 grid">
            <h3>
              <Link
                href={url}
                className="border-solid border-b-2 border-orange-950"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ogp.title}
              </Link>
            </h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                {user_id.displayName}
              </p>
              <p>{comment}</p>
              <p className="text-xs text-end">
                投稿日 {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostCard;
