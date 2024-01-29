import React from "react";

const Ogp = ({ image, title }: { image: string; title: string }) => {
  return (
    <figure className="h-2/4 bg-white">
      <img src={image} alt={title} className="w-full h-full object-contain" />
    </figure>
  );
};

export default Ogp;
