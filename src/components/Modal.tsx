import Button from "@/ui/Button";
import React from "react";

const Modal = ({
  onSubmitEvent,
  setDisplayName,
}: {
  onSubmitEvent: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <article className="fixed z-10 bg-black bg-opacity-50 w-screen h-screen top-0 left-0 flex justify-center items-center">
      <section className="bg-white w-96 h-80 p-10 text-center">
        <h3 className="text-xl">表示名が設定されていません</h3>
        <p className="my-2">表示名の設定をお願いします。</p>
        <form className="my-10 flex flex-col gap-4" onSubmit={onSubmitEvent}>
          <input
            type="text"
            placeholder="表示名"
            className="rounded-2xl p-2 bg-orange-200 w-full"
            required
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button content="登録する" onClickEvent={null} />
        </form>
      </section>
    </article>
  );
};

export default Modal;
