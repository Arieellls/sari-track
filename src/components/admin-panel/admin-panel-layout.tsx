"use client";

import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "../../../server/user";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(undefined);
  const router = useRouter();
  const sidebar = useStore(useSidebar, (x) => x);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      if (!fetchedUser) {
        router.push("/login"); // Bye bye
      } else {
        setUser(fetchedUser);
      }
    };

    fetchUser();
  }, [router]);

  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  // if (user === undefined) {
  //   return <div>Loading...</div>; // Or a spinner. Or your soul, slowly evaporating.
  // }

  return (
    <>
      {user && (
        <>
          <Sidebar />
          <main
            className={cn(
              "min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
              !settings.disabled &&
                (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
            )}
          >
            {children}
          </main>
          <footer
            className={cn(
              "transition-[margin-left] duration-300 ease-in-out",
              !settings.disabled &&
                (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
            )}
          >
            {/* <Footer /> */}
          </footer>
        </>
      )}
    </>
  );
}
