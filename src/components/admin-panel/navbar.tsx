"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { getUser } from "../../../server/user";
import { useEffect } from "react";
import { useUserStore } from "@/hooks/useUserStore";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    };
    fetchUser();
  }, [setUser]);

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
