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
    <div className="relative flex items-center justify-center w-full min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center h-full w-96"
      >
        <div className="my-4 self-start">
          <h1 className="text-xl font-semibold">
            Sari-Track Management System
          </h1>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        <div className="w-full pt-2 space-y-2">
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

        <div className="w-full pt-2 space-y-2">
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

        <div className="w-full pt-2 space-y-2">
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

        <Button type="submit" className="w-full mt-6" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>

        <Button
          asChild
          variant="secondary"
          disabled={isPending}
          className="w-full mt-5"
        >
          <Link
            className={`bg-slate-300 hover:bg-slate-200 w-full text-center py-2 rounded ${
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
