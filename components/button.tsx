"use client";

import { useState } from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      className="bg-neutral-200 text-black font-medium rounded-2xl text-center transition-colors h-10 disabled:bg-neutral-400 disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
}