import PostCard from "@/components/postCard";
import React from "react";
import { Post } from "@/types";

type PostsProps = {
  posts: Post[];
};

const Posts = ({ posts }: PostsProps) => {
  const post = {
    id: "id",
    title: "title",
    comment: "めっちゃ美味しい",
    url: "https://www.lindt.jp/c/onlineshop/collection/lindor/9701225",
    postedBy: "topi",
    tags: ["tag1", "tag2", "tag3"],
  };
  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      <div className="grid grid-cols-4 gap-4">
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
        <PostCard post={post} />
      </div>
    </article>
  );
};

export default Posts;
