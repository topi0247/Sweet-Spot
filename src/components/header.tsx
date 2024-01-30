"use client";

import Link from "next/link";
import RoutesPath from "@/common/routerPath";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByEmail } from "@/utils/supabaseClient";
import { UserData } from "@/types";

const Headers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({} as UserData);

  const router = useRouter();
  const logout = async () => {
    await signOut(auth)
      .then(() => {
        router.push(RoutesPath.Login);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.log(error);
        // TODO: エラー処理
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

  useEffect(() => {
    if (isLoggedIn && auth.currentUser?.email) {
      getUserByEmail(auth.currentUser.email).then((result) => {
        if (result && "id" in result) {
          setUser({
            id: result.id,
            uid: result.uid,
            displayName: result.displayName,
          });
        }
      });
    }
  }, [isLoggedIn]);

  const handleLogo = () => {
    if (isLoggedIn) {
      router.push(RoutesPath.Posts);
    } else {
      router.push(RoutesPath.Home);
    }
  };

  return (
    <header className="flex justify-between items-center container mx-auto my-10 border-b border-orange-900">
      <h1 className="p-4 text-3xl">
        <button onClick={() => handleLogo()}>
          <img src="/Sweet Spot!.png" className="object-cover h-12 w-48" />
        </button>
      </h1>
      <nav>
        <ul className="flex items-center">
          <li>
            <Link
              className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
              href={RoutesPath.Posts}
            >
              投稿一覧
            </Link>
          </li>
          <li>
            <Link
              className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
              href={RoutesPath.CreatePost}
            >
              投稿する
            </Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
                  href={RoutesPath.Logout}
                >
                  新規登録
                </Link>
              </li>
              <li>
                <Link
                  className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
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
                  className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
                  href={`${RoutesPath.MyPage}${user?.uid}`}
                >
                  マイページ
                </Link>
              </li>
              <li>
                <button
                  className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
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
