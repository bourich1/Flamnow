"use client";

import React, { createContext, useContext, useState } from "react";

export type CursorType = "default" | "hover" | "text" | "hide" | "red" | "image";

interface CursorContextType {
  cursorType: CursorType;
  cursorText: string;
  cursorImage: string;
  setCursorType: (type: CursorType) => void;
  setCursorText: (text: string) => void;
  setCursorImage: (image: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState<string>("");
  const [cursorImage, setCursorImage] = useState<string>("");

  return (
    <CursorContext.Provider
      value={{
        cursorType,
        cursorText,
        cursorImage,
        setCursorType,
        setCursorText,
        setCursorImage,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
