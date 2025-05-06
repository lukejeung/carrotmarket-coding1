"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import {
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

interface LoginResponse {
  email: FormDataEntryValue | null;
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  message?: string;
  errors?: Record<string, string[]>;
  loggedIn?: boolean;
}

const formSchema = z
  .object({
    email: z.string().email().endsWith("@zod.com").toLowerCase(),
    username: z.string().min(USERNAME_MIN_LENGTH),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  })
  .superRefine(async ({ username, email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
        email,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "An account with this email and username does not exist.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function logIn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return {
      ...data,
      loggedIn: false,
      errors: result.error.flatten().fieldErrors,
    };
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
        username: result.data.username,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/");
    } else {
      return {
        ...data,
        loggedIn: false,
        errors: {
          password: ["Wrong password."],
        },
      };
    }

    // 기존 과제에서 로그인 후 성공을 표시
    // return {
    //   ...data,
    //   loggedIn: true,
    // };
  }
}