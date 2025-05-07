"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import { ProfileState } from "@/components/profile";

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
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
      .optional()
      .or(z.literal("")),
    confirm_password: z.string().optional().or(z.literal("")),
    bio: z.string().optional(),
    id: z.string(),
  })
  .superRefine(async ({ username, id }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
        NOT: {
          user_no: Number(id),
        },
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
  .superRefine(async ({ email, id }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
        NOT: {
          user_no: Number(id),
        },
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
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return checkPasswords({
          password: data.password,
          confirm_password: data.confirm_password || "",
        });
      }
      return true;
    },
    {
      message: "Both passwords should be the same!",
      path: ["confirm_password"],
    }
  );

interface UpdateData {
  email: string;
  username: string;
  password?: string;
  bio?: string;
}

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000));
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    bio: formData.get("bio"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    id: formData.get("id"),
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return {
      ...data,
      errors: result.error.flatten().fieldErrors,
    };
  } else {
    const updateData: UpdateData = {
      email: result.data.email,
      username: result.data.username,
    };

    if (result.data.password) {
      const hashedPassword = await bcrypt.hash(result.data.password, 12);
      updateData.password = hashedPassword;
    }

    if (result.data.bio !== undefined && result.data.bio !== "") {
      updateData.bio = result.data.bio;
    }

    const updatedUser = await db.user.update({
      where: { user_no: Number(data.id) },
      data: updateData,
      select: {
        user_no: true,
        email: true,
        username: true,
        bio: true,
      },
    });

    revalidatePath(`/users/${data.username}/edit`);
    return { ...result.data, success: true, updatedUser };
  }
}