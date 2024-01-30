"use client";
import RoutesPath from "@/common/RouterPath";
import { auth, provider } from "@/utils/firebase";
import { registerUser } from "@/utils/supabaseClient";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateUser = () => {
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithPopup(auth, provider).then((result) => {
      if (displayName === "" && result.user.displayName) {
        setDisplayName(result.user.displayName);
      }
      if (result.user.email) {
        registerUser(displayName, result.user.email, result.user.uid);
      }
      router.push(RoutesPath.Posts);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  return (
    <article>
      <h2 className="text-center text-2xl m-5">新規登録</h2>
      <section className="mx-auto bg-orange-100 w-96 p-5">
        <form
          className="flex flex-col justify-center items-center gap-3"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>
              表示名
              <br />
            </label>
            <input
              type="text"
              className="bg-slate-50 p-1 hover:outline-none focus:outline-none"
              onChange={handleChange}
            />
            <span className="text-sm text-gray-500">
              ※無記入の場合、Googleの表示名が使用されます
            </span>
          </div>
          <button className="p-4 bg-slate-50 hover:bg-orange-900 hover:text-slate-50 transition-all">
            Googleで新規登録
          </button>
        </form>
      </section>
    </article>
  );
};

export default CreateUser;
