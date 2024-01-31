"use client";

import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useRouter } from "next/navigation";
import RoutesPath from "@/common/RouterPath";
import Button from "../ui/Button";

const Login = () => {
  const router = useRouter();
  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((res) => {
      router.push(RoutesPath.Posts);
    });
  };
  return (
    <section className="text-center">
      <h2 className="text-center text-2xl mb-10">ログイン</h2>
      <Button content="Googleでログイン" onClickEvent={loginInWithGoogle} />
    </section>
  );
};

export default Login;
