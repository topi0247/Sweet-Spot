"use client";

import React from "react";

const Footers = () => {
  const mb = () => {
    if (window.innerWidth < 768) {
      return "mb-8";
    }
  };
  return (
    <footer className={`p-4 text-center ${mb()}`}>@2023 Sweet Spot!</footer>
  );
};

export default Footers;
