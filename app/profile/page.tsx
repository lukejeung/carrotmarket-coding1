import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Profile from "@/components/profile";

async function getUser() {
  const session = await getSession();
  if (session && session.user.id) {
    const user = await db.user.findUnique({
      where: {
        user_no: Number(session.user.id),
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function ProfilePage() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    await getSession();
    redirect("/");
  };
  return <Profile user={user} logOut={logOut} enableEdit={false} />;
}
