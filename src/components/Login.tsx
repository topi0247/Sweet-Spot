"use client";

import React, { useEffect, useState } from "react";
import { deleteUser, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useRouter } from "next/navigation";
import RoutesPath from "@/common/RouterPath";
import Button from "../ui/Button";
import Link from "next/link";
import { getUserByUid } from "@/utils/supabaseClient";

const Login = () => {
  const [userUid, setUserUid] = useState("");
  const router = useRouter();
  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((res) => {
      if (res.user) {
        setUserUid(res.user.uid);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserByUid(userUid);
      if (user) {
        router.push(RoutesPath.Posts);
      } else if (auth.currentUser) {
        deleteUser(auth.currentUser);
        alert("ログインに失敗しました。");
      }
    };
    fetchData();
  }, [userUid]);

  return (
    <section className="text-center">
      <h2 className="text-center text-2xl mb-10 mt-2">ログイン</h2>
      <Button content="Googleでログイン" onClickEvent={loginInWithGoogle} />
      <p className="m-5">
        アカウント作成がまだの方は
        <Link
          href={RoutesPath.Signin}
          className="border-b-2 border-orange-500 border-radius-10"
        >
          こちら
        </Link>
        から
      </p>
      <p>
        ログインに失敗する場合は
        <Link
          href={RoutesPath.Signin}
          className="border-b-2 border-orange-500 border-radius-10"
        >
          新規登録
        </Link>
        からもお試しください。
      </p>
    </section>
  );
};

export default Login;
