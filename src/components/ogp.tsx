import React from "react";

const Ogp = ({ image, title }: { image: string; title: string }) => {
  return (
    <figure className="h-2/4 bg-slate-200 rounded-2xl rounded-b-none">
      <img
        src={image === "" ? "/Sweet Spot!.png" : image}
        alt={title}
        className="w-full h-full object-contain"
      />
    </figure>
  );
};

export default Ogp;
