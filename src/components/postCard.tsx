"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { getOGP } from "@/common/getOgp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

type PostCardProps = {
  post: Post;
};

type OgpData = {
  title: string;
  image: string;
};

const PostCard = ({ post }: PostCardProps) => {
  const [ogp, setOgp] = useState({} as OgpData);
  const { title, comment, url, postedBy, tags } = post;

  useEffect(() => {
    const getMetadata = async () => {
      const result = await getOGP(url);
      setOgp(result);
    };
    getMetadata();
  }, []);

  return (
    <section className="text-orange-900 body-font w-full h-80">
      <div className="card h-full bg-orange-200 shadow-xl rounded-none">
        <figure>
          <Link href={url} target="_blank">
            <img src={ogp.image} alt={ogp.title} />
          </Link>
        </figure>
        <div className="card-body p-5">
          <h2 className="card-title">{title}</h2>
          <p>{postedBy}</p>
          <div className="flex justify-between">
            <p>{comment}</p>
            <Link href={url} className="text-xs">
              <FontAwesomeIcon
                className="mr-1"
                icon={faArrowUpRightFromSquare}
              />
              ページへ飛ぶ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostCard;
