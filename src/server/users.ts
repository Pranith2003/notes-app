"use server";

import { auth } from "@/lib/auth";

export const signInUser = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true, message: "Signed In successfully" };
  } catch (error) {
    const e = error as Error;
    console.log(error);
    return {
      success: false,
      message: e.message || "Failed to SignIn",
    };
  }
};

export const signUpUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return { success: true, message: "Signed Up successfully" };
  } catch (error) {
    console.log(error);
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to SignUp",
    };
  }
};
