import React from "react";

const NewPost = () => {
  return (
    <section className="w-full mx-auto">
      <h2 className="text-center text-2xl">投稿する</h2>
      <div className="bg-orange-200 p-4 w-96 mx-auto my-5">
        <form className="flex  flex-col gap-5">
          <label>
            URL
            <input
              type="url"
              className="w-full bg-white focus:outline-none p-2"
            />
          </label>
          <label>
            コメント
            <input
              type="text"
              className="w-full bg-white focus:outline-none p-2"
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
