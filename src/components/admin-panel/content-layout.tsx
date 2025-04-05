"use client"; // Important: This must be a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/admin-panel/navbar";
import { getUser } from "../../../server/user";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
}
