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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPc, setIsPc] = useState(false);

  const router = useRouter();
  const logout = async () => {
    await signOut(auth).then(() => {
      router.push(RoutesPath.Login);
      setIsLoggedIn(false);
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
    setIsMobile(window.innerWidth <= 768);
    setIsTablet(769 < window.innerWidth && window.innerWidth < 1024);
    setIsPc(1024 <= window.innerWidth);
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

  useEffect(() => {
    setIsLoggedIn(auth.currentUser?.email ? true : false);
  }, [auth.currentUser]);

  const handleLogo = () => {
    if (isLoggedIn) {
      router.push(RoutesPath.Posts);
    } else {
      router.push(RoutesPath.Home);
    }
  };

  return (
    <>
      {isMobile && (
        <MobileHeader
          handleLogo={handleLogo}
          isLoggedIn={isLoggedIn}
          logout={logout}
          user={user}
        />
      )}
      {isTablet && (
        <TabletHeader
          handleLogo={handleLogo}
          isLoggedIn={isLoggedIn}
          logout={logout}
          user={user}
        />
      )}
      {isPc && (
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
