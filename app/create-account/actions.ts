"use server";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export interface CreateAccountState {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
  };
  error?: string;
}

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    email: z.string().email().endsWith("@zod.com").toLowerCase().trim(),
    username: z.string().min(USERNAME_MIN_LENGTH).trim(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        user_no: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        user_no: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAccount(formData: FormData): Promise<CreateAccountState> {
  const data = {
    username: formData.get("username")?.toString() ?? undefined,
    email: formData.get("email")?.toString() ?? undefined,
    password: formData.get("password")?.toString() ?? undefined,
    confirm_password: formData.get("confirm_password")?.toString() ?? undefined,
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return {
  username: data.username as string,
  email: data.email as string,
  password: data.password as string,
  confirm_password: data.confirm_password as string,
  errors: result.error.flatten().fieldErrors,
};
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
      bio: "",
    },
    select: {
      user_no: true,
    },
  });

  const session = await getSession();
  if (!session) {
    return { error: "세션을 가져올 수 없습니다. 다시 로그인해주세요." };
  }

  session.user.id = String(user.user_no);
  redirect("/profile");

  // 👇 명시적으로 무언가 반환해야 에러 방지됨
  return {};
}


