"use client";
import RoutesPath from "@/common/RouterPath";
import { UserData } from "@/types";
import Link from "next/link";
import React from "react";

const PCHeader = ({
  handleLogo,
  isLoggedIn,
  logout,
  user,
}: {
  handleLogo: () => void;
  isLoggedIn: boolean;
  logout: () => void;
  user: UserData;
}) => {
  return (
    <header className="flex justify-between items-center container mx-auto mt-10 border-b border-orange-900">
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
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  className="p-4 hover:bg-slate-200 transition-all rounded-2xl"
                  href={RoutesPath.Signin}
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
                  href={RoutesPath.CreatePost}
                >
                  投稿する
                </Link>
              </li>
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

export default PCHeader;
