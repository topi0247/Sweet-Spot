"use client";

import RoutesPath from "@/common/RouterPath";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByEmail } from "@/utils/supabaseClient";
import { UserData } from "@/types";
import PCHeader from "@/components/PCHeader";
import TabletHeader from "./TabletHeader";
import MobileHeader from "./MobileHeader";

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
  const getWindowWidth = () => {
    return window.innerWidth;
  };

  const isMobile = () => {
    return getWindowWidth() < 768;
  };

  const isTablet = () => {
    return getWindowWidth() >= 768 && getWindowWidth() < 1024;
  };

  const isPC = () => {
    return getWindowWidth() >= 1024;
  };

  return (
    <>
      {isMobile() && (
        <MobileHeader
          handleLogo={handleLogo}
          isLoggedIn={isLoggedIn}
          logout={logout}
          user={user}
        />
      )}
      {isTablet() && (
        <TabletHeader
          handleLogo={handleLogo}
          isLoggedIn={isLoggedIn}
          logout={logout}
          user={user}
        />
      )}
      {isPC() && (
        <PCHeader
          handleLogo={handleLogo}
          isLoggedIn={isLoggedIn}
          logout={logout}
          user={user}
        />
      )}
    </>
  );
};

export default Headers;
