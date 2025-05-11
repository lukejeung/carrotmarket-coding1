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
export async function createAccount(
  formData: FormData
): Promise<CreateAccountState | void> {
  const data = {
    username: formData.get("username")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    confirm_password: formData.get("confirm_password")?.toString() || "",
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return {
      ...data,
      errors: result.error.flatten().fieldErrors,
    };
  } else {
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
      return {
        ...data,
        error: "세션을 가져올 수 없습니다. 다시 로그인해주세요.",
      };
    }
    session.user.id = String(user.user_no); // 문자열 변환 필요
    // session.save(); // 세션 저장 필요 시 사용
    redirect("/profile");
  }
}

