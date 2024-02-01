import type { NextApiRequest, NextApiResponse } from "next";

const proxyApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  if (typeof url !== "string") {
    // url が指定されていない場合
    return res.status(400);
  }
  if (req.method !== "GET") {
    // GET 以外のメソッドでアクセスされた場合(GET のみに対応）
    return res.status(405);
  }

  const response = await fetch(url);

  // 文字コード取得とデコード
  const arrayBuffer = await response.arrayBuffer();
  let decode_text = new TextDecoder().decode(arrayBuffer);
  const charset = decode_text.match(/<meta[^>]+charset=["']?([^"'>\s]+)/i);
  if (charset && charset[1] !== "utf-8") {
    const decoder = new TextDecoder(charset[1]);
    decode_text = decoder.decode(arrayBuffer);
  }

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(decode_text);
};

export default proxyApi;
