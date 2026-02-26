import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST() {
  await auth.api.signOut({
    headers: await headers(),
  });

  return NextResponse.json({ success: true });
}
