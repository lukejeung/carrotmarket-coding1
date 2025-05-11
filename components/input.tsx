import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className={
          errors.length > 0
            ? "placeholder:text-red-400 bg-transparent rounded-full w-full h-10 ring-2 ring-red-300 focus:ring-red-300 focus:ring-offset-2 outline-red-300 transition px-2"
            : "placeholder:text-neutral-400 bg-transparent rounded-full w-full h-10 ring-2 ring-neutral-300 focus:ring-neutral-300 focus:ring-offset-2 outline-neutral-300 transition px-2"
        }
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}