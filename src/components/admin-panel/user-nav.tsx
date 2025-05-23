"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { formatName } from "../../lib/formatName";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
type UserProps = {
  name?: string | null;
  email?: string | null;
  id?: string | null;
};

export function UserNav({ user }: { user?: UserProps }) {
  const router = useRouter();
  const handleSignOut = async () => {
    console.log("Attempting to sign out...");
    try {
      authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {formatName(user?.name || "--")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom">Profile</TooltipContent>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "--"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "--"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href="/dashboard" className="flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href="/account" className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
