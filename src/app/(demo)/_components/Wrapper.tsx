import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({
  children,
  className
}: SectionWrapperProps) {
  return (
    <Card className="w-full rounded-lg border-none mt-6">
      <CardContent className="p-6 w-full">
        <div
          className={`flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] ${
            className || ""
          }`}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
