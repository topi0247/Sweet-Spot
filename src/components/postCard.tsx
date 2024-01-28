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
      <div className="card h-full bg-orange-200 shadow-xl rounded-none hover:translate-y-2 hover:shadow-none transition-all">
        <figure>
          <img src={ogp.image} alt={ogp.title} />
        </figure>
        <div className="card-body p-5">
          <h3>
            <Link
              href={url}
              className="border-solid border-b-2 border-orange-950"
            >
              {ogp.title}
            </Link>
          </h3>
          <p>{postedBy}</p>
          <div className="flex justify-between items-center">
            <p>{comment}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostCard;
