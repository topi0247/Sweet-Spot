"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./page.css";
import Link from "next/link";
import RoutesPath from "@/common/RouterPath";

const images = [
  "/basicSlider/1.jpg",
  "/basicSlider/2.jpg",
  "/basicSlider/3.jpg",
  "/basicSlider/4.jpg",
  "/basicSlider/5.jpg",
  "/basicSlider/6.jpg",
];

const Home = () => {
  return (
    <article>
      <section className="mb-10">
        <h2 className="text-center">
          <Image
            src="/Sweet Spot!.png"
            loading="lazy"
            alt="ロゴ"
            width={640}
            height={400}
            className="w-80 object-cover mx-auto mb-4"
            style={{ height: 100 }}
          />
        </h2>
        <h3 className="text-2xl text-center">
          オススメチョコレートシェアサイト
        </h3>
      </section>
      <section>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={3}
          pagination={{
            clickable: true,
          }}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={true}
          centeredSlides={true}
          className="w-full"
        >
          {images.map((src: string, index: number) => {
            return (
              <SwiperSlide key={`${index}`}>
                <Image
                  src={src}
                  loading="lazy"
                  width={640}
                  height={400}
                  alt={`トップ画像${index}`}
                  className="aspect-square object-cover"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
      <section className="text-center text-xl my-4">
        <p className="my-2">
          Sweet
          Spot!はバレンタイン&ホワイトーデーに向け、チョコレートやお菓子を紹介し合うシェアサイトです。
        </p>
        <p className="my-2">
          あなたのオススメのチョコレートをシェアしましょう！
        </p>
      </section>
      <section className="grid grid-cols-2 m-20 mt-10 gap-10">
        <div className="bg-orange-100 p-5 pt-5 rounded-2xl">
          <h2 className="text-center text-2xl my-2">ユーザーができること</h2>
          <ul className="m-5 text-center">
            <li>投稿一覧を見る</li>
            <li>投稿された詳細を見る</li>
            <li>投稿された詳細からお店や商品のページをチェックできる</li>
          </ul>
          <h4 className="text-center text-sky-400 text-xl">
            <Link href={RoutesPath.Posts}>
              みんなのオススメをチェックする！
            </Link>
          </h4>
        </div>
        <div className="bg-orange-100 p-5 pt-5 rounded-2xl">
          <h2 className="text-center text-2xl my-2">
            ログインするとできること
          </h2>
          <ul className="m-5 text-center">
            <li>投稿一覧を見る</li>
            <li>投稿された詳細を見る</li>
            <li>投稿された詳細からお店や商品のページをチェックできる</li>
            <li className="text-red-500">★投稿できる</li>
            <li className="text-red-500">★いいねができる</li>
            <li className="text-red-500">★自分の投稿した一覧が見れる</li>
            <li className="text-red-500">★自分がいいねした一覧が見える</li>
          </ul>
          <h4 className="text-center text-sky-400 text-xl">
            <Link href={RoutesPath.Signin}>新規登録して投稿する！</Link>
          </h4>
        </div>
      </section>
    </article>
  );
};

export default Home;
