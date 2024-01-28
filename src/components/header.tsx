import Link from "next/link";
import Router from "@/common/router";

const Headers = () => {
  return (
    <header className="flex justify-between items-center container mx-auto my-10 border-b border-orange-900">
      <h1 className="p-4 text-3xl">
        <Link href={Router.Home}>バレチョコ！</Link>
      </h1>
      <nav>
        <ul className="flex">
          <li className="p-4 hover:bg-slate-50 transition-all">
            <Link href={Router.Posts}>投稿一覧</Link>
          </li>
          <li className="p-4 hover:bg-slate-50 transition-all">
            <Link href={Router.CreatePost}>投稿する</Link>
          </li>
          <li className="p-4 hover:bg-slate-50 transition-all">
            <Link href={Router.Signup}>新規登録</Link>
          </li>
          <li className="p-4 hover:bg-slate-50 transition-all">
            <Link href={Router.Login}>ログイン</Link>
          </li>
          <li className="p-4 hover:bg-slate-50 transition-all">
            <Link href={Router.MyPage}>マイページ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Headers;
