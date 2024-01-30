"use client";

export const getWindowWidth = () => {
  return window.innerWidth;
};

export const isMobile = () => {
  return getWindowWidth() < 768;
};

export const isTablet = () => {
  return getWindowWidth() >= 768 && getWindowWidth() < 1024;
};

export const isPC = () => {
  return getWindowWidth() >= 1024;
};
