import React from "react";

const Post = async ({ params }: { params: { uuid: string } }) => {
  return <div>{params.uuid}</div>;
};

export default Post;
