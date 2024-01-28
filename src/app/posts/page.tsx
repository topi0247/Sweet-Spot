import PostCard from "@/components/postCard";
import React from "react";
import { Post } from "@/types";

type PostsProps = {
  posts: Post[];
};

const Posts = () => {
  const posts = [] as Post[];
  return (
    <article>
      <h2 className="text-center text-2xl m-5">投稿一覧</h2>
      {posts.length === 0 && (
        <p className="block text-center">投稿はありません</p>
      )}
      <div className="grid grid-cols-4 gap-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
};

export default Posts;
