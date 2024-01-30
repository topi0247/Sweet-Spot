import React from "react";

const Ogp = ({ image, title }: { image: string; title: string }) => {
  return (
    <figure className="h-full">
      <img
        src={image === "" ? "/Sweet Spot!.png" : image}
        alt={title}
        className="w-full h-full object-contain"
      />
    </figure>
  );
};

export default Ogp;
