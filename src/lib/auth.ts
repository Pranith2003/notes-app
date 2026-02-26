import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schemas";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  // emailVerification: {
  //     sendVerificationEmail: async ({ user, url, token }, request) => {
  //         await sendEmail({
  //             to: user.email,
  //             subject: "Verify Your Email Address",
  //             text: `Click to verify your email: ${url}`
  //         })
  //     },
  // },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
