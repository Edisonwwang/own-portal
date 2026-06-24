"use server";

import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter the password." };
  }

  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  setSessionCookie();
  redirect("/");
}
