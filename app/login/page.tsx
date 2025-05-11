"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { logIn } from "./actions";

interface LoginState {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  };
  loggedIn?: boolean;
}

export default function Login() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({ 
    errors: {},
    loggedIn: false 
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await logIn(null, formData);
    setState(result as LoginState);
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen w-screen">
        <div className="text-6xl mb-10">🔥</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
          <Input
            name="email"
            type="email"
            placeholder="✉️Email"
            required
            errors={state?.errors?.email}
          />
          <Input
            name="username"
            type="text"
            placeholder="👤Username"
            required
            errors={state?.errors?.username}
          />
          <Input
            name="password"
            type="password"
            placeholder="🔑Password"
            required
            errors={state?.errors?.password}
          />
          <Button text="Log in" />
        </form>
        <div className="flex flex-col mt-2 w-64">
          <Button
            text="Create account"
            onClick={() => router.push("/create-account")}
          />
        </div>
        {state.loggedIn && (
          <div className="bg-green-400 w-64 h-12 rounded-xl flex items-center justify-center text-black mt-3">
            ✔ Welcome back!
          </div>
        )}
      </div>
    </div>
  );
}