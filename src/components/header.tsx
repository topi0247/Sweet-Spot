"use client";

import Link from "next/link";
import RoutesPath from "@/common/routerPath";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Headers = () => {
  const router = useRouter();
  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("ログアウトしました");
        router.push(RoutesPath.Login);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          {auth.currentUser === null ? (
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
                  href={RoutesPath.MyPage}
                >
                  マイページ
                </Link>
              </li>
              <li>
                <button
                  className="p-4 hover:bg-slate-50 transition-all"
                  onClick={() => logout}
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
