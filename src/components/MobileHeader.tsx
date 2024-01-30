"use client";

import RoutesPath from "@/common/RouterPath";
import { UserData } from "@/types";
import Link from "next/link";
import React, { useEffect } from "react";

const MobileHeader = ({
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <>
      <header className="w-full flex justify-center items-center border-b border-orange-900">
        <h1 className="p-4 text-3xl">
          <button onClick={() => handleLogo()}>
            <img src="/Sweet Spot!.png" className="object-cover h-12 w-48" />
          </button>
        </h1>
      </header>
      <nav className="fixed bottom-0 w-full border-t border-orange-900 bg-white z-10">
        <ul className="grid grid-cols-3 items-center ">
          <li className="text-center border-r">
            <Link className="p-2" href={RoutesPath.Posts}>
              投稿一覧
            </Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="text-center border-r">
                <Link className="p-2" href={RoutesPath.Logout}>
                  新規登録
                </Link>
              </li>
              <li className="text-center">
                <Link className="p-2" href={RoutesPath.Login}>
                  ログイン
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-center border-r">
                <Link className="p-2" href={RoutesPath.CreatePost}>
                  投稿する
                </Link>
              </li>
              <li className="text-center">
                <div className="relative w-full">
                  <button
                    className="p-2"
                    onClick={() => toggleMenu(!isMenuOpen)}
                  >
                    マイページ
                  </button>
                  {isMenuOpen && (
                    <ul className="p-2 absolute w-full bottom-full inset-x-auto bg-white border-t border-r border-l border-orange-900">
                      <li className="pb-2 border-b">
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                        >
                          ログアウト
                        </button>
                      </li>
                      <li className="pt-2">
                        <Link href={`${RoutesPath.MyPage}/${user.uid}`}>
                          マイページ
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default MobileHeader;
