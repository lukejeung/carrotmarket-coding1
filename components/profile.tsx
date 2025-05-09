"use client";

import BackButton from "@/app/components/back-button";
import { User } from "@prisma/client";
import { updateProfile } from "@/app/users/[username]/edit/actions";
import Input from "./input";
import Button from "./button";
import { PASSWORD_MIN_LENGTH } from "../lib/constants";
import { useState } from "react";

export type ProfileState = {
 success?: boolean;
 errors?: {
   username?: string[];
   password?: string[];
   email?: string[];
   bio?: string[];
   confirm_password?: string[];
 };
 updatedUser?: User;
 username: FormDataEntryValue | null;
 email: FormDataEntryValue | null;
 bio: FormDataEntryValue | null;
 password: FormDataEntryValue | null;
 confirm_password: FormDataEntryValue | null;
 id: FormDataEntryValue | null;
} | null;

export default function Profile({
 user,
 logOut,
 enableEdit = false,
}: {
 user: User;
 logOut: () => void;
 enableEdit: boolean;
}) {
 const [successMessage, setSuccessMessage] = useState(false);
 const [profileState, setProfileState] = useState<ProfileState>({
   username: user.username as FormDataEntryValue,
   email: user.email as FormDataEntryValue,
   bio: user.bio as FormDataEntryValue,
   password: null,
   confirm_password: null,
   id: user.user_no.toString() as FormDataEntryValue,
 });

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   const formData = new FormData(e.currentTarget);
   
   try {
     // 낙관적 업데이트
     setProfileState({
       username: formData.get("username") || null,
       email: formData.get("email") || null,
       bio: formData.get("bio") || null,
       password: formData.get("password") || null,
       confirm_password: formData.get("confirm_password") || null,
       id: formData.get("id") || null
     });

     const result = await updateProfile(profileState, formData);

     if ("errors" in result) {
       setSuccessMessage(false);
       setProfileState({
         username: formData.get("username") || null,
         email: formData.get("email") || null,
         bio: formData.get("bio") || null,
         password: formData.get("password") || null,
         confirm_password: formData.get("confirm_password") || null,
         id: formData.get("id") || null,
         errors: result.errors
       });
       return;
     }

     setSuccessMessage(true);
     setProfileState({
       username: result.username as FormDataEntryValue,
       email: result.email as FormDataEntryValue,
       bio: result.bio as FormDataEntryValue,
       password: null,
       confirm_password: null,
       id: result.id as FormDataEntryValue
     });

     setTimeout(() => {
       setSuccessMessage(false);
     }, 3000);

   } catch (error) {
     console.error("Profile update error:", error);
     setProfileState({
       username: profileState?.username || null,
       email: profileState?.email || null,
       bio: profileState?.bio || null,
       password: null,
       confirm_password: null,
       id: profileState?.id || null,
       errors: {
         username: ["업데이트 중 오류가 발생했습니다."]
       }
     });
   }
 };

 return (
   <div className="max-w-2xl mx-auto p-4">
     <BackButton />
     <h1 className="text-2xl font-bold my-6">Welcome! {user?.username}!</h1>
     <form action={logOut}>
       <button className="bg-red-500 text-white px-4 py-2 rounded mb-6">
         Log out
       </button>
     </form>

     <div className="bg-white p-6 rounded-lg shadow">
       <h2 className="text-xl font-semibold mb-4">프로필 정보</h2>
       {successMessage && (
         <p className="text-green-500 mb-4">
           프로필이 성공적으로 업데이트되었습니다!
         </p>
       )}
       {enableEdit ? (
         <form
           onSubmit={handleSubmit}
           className="flex flex-col gap-3"
         >
           <input
             type="hidden"
             name="id"
             value={profileState?.id?.toString() || ""}
           />
           <Input
             name="username"
             type="text"
             placeholder="사용자명"
             required
             errors={profileState?.errors?.username}
             defaultValue={profileState?.username?.toString() || ""}
           />
           <Input
             name="email"
             type="email"
             placeholder="이메일"
             required
             errors={profileState?.errors?.email}
             defaultValue={profileState?.email?.toString() || ""}
           />
           <Input
             name="bio"
             type="text"
             placeholder="자기소개"
             errors={profileState?.errors?.bio}
             defaultValue={profileState?.bio?.toString() || ""}
           />
           <Input
             name="password"
             type="password"
             placeholder="비밀번호"
             minLength={PASSWORD_MIN_LENGTH}
             errors={profileState?.errors?.password}
             defaultValue={profileState?.password?.toString() || ""}
           />
           <Input
             name="confirm_password"
             type="password"
             placeholder="비밀번호 확인"
             minLength={PASSWORD_MIN_LENGTH}
             errors={profileState?.errors?.confirm_password}
             defaultValue={profileState?.confirm_password?.toString() || ""}
           />
           <Button text="저장하기" />
         </form>
       ) : (
         <div className="space-y-3">
           <p>
             <span className="font-medium">이메일:</span> {user.email}
           </p>
           <p>
             <span className="font-medium">가입일:</span>{" "}
             {user.created_dt.toLocaleDateString()}
           </p>
           <p>
             <span className="font-medium">자기소개:</span>{" "}
             {user.bio || "아직 작성된 자기소개가 없습니다."}
           </p>
         </div>
       )}
     </div>
   </div>
 );
}