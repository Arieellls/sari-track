"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

export default async function AvatarDisplay() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="#" alt="Avatar" />
      <AvatarFallback className="bg-transparent">
        {formatName(session?.user?.name || "UN")}
      </AvatarFallback>
    </Avatar>
  );
}
