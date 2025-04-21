"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signUp } from "../../../server/user";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    if (!email || !password || !name) {
      setError("All fields are required");
      return;
    }

    startTransition(async () => {
      try {
        await signUp(formData);
        router.push("/"); // or redirect to login page
        router.refresh();
      } catch (error) {
        setError("Signup failed. Please try again.");
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
            SARI-Track: Smart Automated Retail Inventory
          </h1>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        <div className="w-full space-y-2 pt-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            disabled={isPending}
            required
          />
        </div>

        <div className="w-full space-y-2 pt-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            disabled={isPending}
            required
          />
        </div>

        <div className="w-full space-y-2 pt-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            disabled={isPending}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>

        <Button
          asChild
          variant="secondary"
          disabled={isPending}
          className="mt-5 w-full"
        >
          <Link
            className={`w-full rounded bg-slate-300 py-2 text-center hover:bg-slate-200 ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
            href="/login"
          >
            Back to Login
          </Link>
        </Button>
      </form>
    </div>
  );
}
