"use client";

import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useRouter } from "next/navigation";
import RoutesPath from "@/common/routerPath";

const Login = () => {
  const router = useRouter();
  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      router.push(RoutesPath.Posts);
    });
  };
  return (
    <section className="text-center">
      <button className="p-4 bg-slate-50 w-1/4" onClick={loginInWithGoogle}>
        Googleでログイン
      </button>
    </section>
  );
};

export default Login;
