import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../server/user";
import { authClient } from "../../lib/auth-client";

export default async function HomePage() {
  const user = await getUser();
  console.log(user);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[50] w-full border-b border-border/40 bg-background/95 backdrop-blur-sm dark:bg-black/[0.6]">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <PanelsTopLeft className="mr-3 h-6 w-6" />
            <span className="font-bold">Sari-Track</span>
            <span className="sr-only">Sari-Track</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background"
              asChild
            >
              {/* <Link href="https://github.com/Arieellls/">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Link> */}
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Sari-Track: Smart Automated Retail Inventory
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              A Web Application for Smarter, Faster, and Effortless Inventory
              Management
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <Link
                  href={`${user ? "/dashboard" : "/login"}`}
                  rel="noopener noreferrer"
                >
                  {user ? "Dashboard" : "Login"}
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register" rel="noopener noreferrer">
                  Sign Up
                </Link>
              </Button>
            </div>
          </section>
          <div className="relative flex w-full justify-center">
            <Image
              src="/landing-page-image.png"
              width={1080}
              height={608}
              alt="demo"
              priority
              className="rounded-xl border shadow-sm dark:hidden"
            />
            <Image
              src="/landing-page-image.png"
              width={1080}
              height={608}
              alt="demo-dark"
              priority
              className="hidden rounded-xl border border-zinc-600 shadow-sm dark:block dark:shadow-gray-500/5"
            />
            <Image
              src="/landing-page-image.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="absolute bottom-0 right-0 hidden rounded-xl border dark:hidden lg:block"
            />
            <Image
              src="/landing-page-image.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="absolute bottom-0 right-0 hidden rounded-xl border border-zinc-600 dark:lg:block"
            />
          </div>
        </div>
      </main>
      {/* <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built on top of{" "}
            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/Arieellls/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer> */}
    </div>
  );
}
