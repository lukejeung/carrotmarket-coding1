"use client";

import { useFormStatus } from "react-dom";

interface FormBtnProps {
  text: string;
}

export default function FormBtn({ text }: FormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="outline-none w-full h-10 transition rounded-xl font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}