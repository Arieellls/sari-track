"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn, signInGoogle, signUp } from "../../../server/user";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    startTransition(async () => {
      try {
        await signIn(formData);
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        setError("Invalid credentials. Please try again.");
      }
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-96 flex-col items-center justify-center"
      >
        <div className="my-4 self-start">
          <h1 className="text-xl font-semibold">
            Sari-Track Management System
          </h1>
          <p className="text-sm text-gray-500">Login your account</p>
        </div>

        <div className="w-full space-y-2 pt-2">
          <Label htmlFor="email" className="pt-4">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            disabled={isPending}
          />
        </div>
        <div className="relative w-full space-y-2 pt-2">
          <Label htmlFor="password" className="pt-4">
            Password
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[40px] text-gray-500 hover:text-black"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="mt-3 text-red-500">{error}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
        <Button
          onClick={async () => {
            const data = await signInGoogle();
            if (data?.data?.url) {
              window.location.href = data.data.url; // <-- Safe to use in client
            }
          }}
          className="mt-2 flex w-full gap-3"
          disabled={isPending}
          type="button"
        >
          Sign in with Google{" "}
          <Image src="/google.png" alt="Google" width={16} height={16} />
        </Button>

        <Button
          asChild
          variant="secondary"
          disabled={isPending}
          className="mt-5 w-full text-gray-800"
        >
          <Link
            href="/register"
            className={`w-full rounded bg-slate-300 py-2 text-center hover:bg-slate-200 ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Create Account
          </Link>
        </Button>
      </form>
    </div>
  );
}
