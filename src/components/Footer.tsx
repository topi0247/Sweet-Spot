"use client";

import React, { useEffect, useState } from "react";

const Footers = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);
  return (
    <footer className={`p-4 text-center ${isMobile && "mb-4"}`}>
      @2023 Sweet Spot!
    </footer>
  );
};

export default Footers;
