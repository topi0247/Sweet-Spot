export const getOGP = async (url: string) => {
  const result = await fetch(`/api/proxy?url=${url}`);
  const html = await result.text();
  const dom = new DOMParser().parseFromString(html, "text/html");

  const data = Array.from(dom.head.children).reduce<{
    title: string;
    image: string;
  }>(
    (result, element) => {
      const property = element.getAttribute("property");
      if (property === "og:title") {
        // title を取得
        result.title = element.getAttribute("content") ?? "";
      }
      if (property === "og:image") {
        // image を取得
        result.image = element.getAttribute("content") ?? "";
      }

      return result;
    },
    { title: "", image: "" }
  );

  return data;
};
