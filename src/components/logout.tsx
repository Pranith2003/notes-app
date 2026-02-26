"use client";

import { LogOut as LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LogOut() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };
  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOutIcon />
    </Button>
  );
}
