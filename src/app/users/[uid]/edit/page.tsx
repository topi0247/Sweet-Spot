"use client";

import Button from "@/ui/Button";
import { UserData } from "@/types";
import { getUserByUid, updateUser } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyPageEdit = ({ params }: { params: { uid: string } }) => {
  const [user, setUser] = useState({} as UserData);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const decodedUid = decodeURIComponent(params.uid);
      const userData = await getUserByUid(decodedUid);
      if (userData) {
        setUser(userData);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (displayName === "") {
      return;
    }
    const res = await updateUser(user.id, displayName);
    if (res.status === 200) {
      router.push(`/users/${user.uid}`);
      alert("表示名を変更しました");
    } else {
      alert("表示名の変更に失敗しました");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  return (
    <article>
      <h2 className="text-center text-2xl m-5">表示名変更</h2>
      <section className="mx-auto bg-orange-100 w-96 p-5">
        <form
          className="flex flex-col justify-center items-center gap-3"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>
              表示名*
              <br />
            </label>
            <input
              type="text"
              className="bg-slate-50 p-1 hover:outline-none focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>
          <Button content="変更する" onClickEvent={null} />
        </form>
      </section>
    </article>
  );
};

export default MyPageEdit;
