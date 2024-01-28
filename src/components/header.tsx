"use client";

import Link from "next/link";
import RoutesPath from "@/common/routerPath";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Headers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uuid, setUuid] = useState("");

  const router = useRouter();
  const logout = async () => {
    await signOut(auth)
      .then(() => {
        router.push(RoutesPath.Login);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="flex justify-between items-center container mx-auto my-10 border-b border-orange-900">
      <h1 className="p-4 text-3xl">
        <Link href={RoutesPath.Home}>バレチョコ！</Link>
      </h1>
      <nav>
        <ul className="flex items-center">
          <li>
            <Link
              className="p-4 hover:bg-slate-50 transition-all"
              href={RoutesPath.Posts}
            >
              投稿一覧
            </Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  className="p-4 hover:bg-slate-50 transition-all"
                  href={RoutesPath.Signup}
                >
                  新規登録
                </Link>
              </li>
              <li>
                <Link
                  className="p-4 hover:bg-slate-50 transition-all"
                  href={RoutesPath.Login}
                >
                  ログイン
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="p-4 hover:bg-slate-50 transition-all"
                  href={RoutesPath.CreatePost}
                >
                  投稿する
                </Link>
              </li>
              <li>
                <Link
                  className="p-4 hover:bg-slate-50 transition-all"
                  href={`RoutesPath.MyPage`}
                >
                  マイページ
                </Link>
              </li>
              <li>
                <button
                  className="p-4 hover:bg-slate-50 transition-all"
                  onClick={() => logout()}
                >
                  ログアウト
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Headers;
