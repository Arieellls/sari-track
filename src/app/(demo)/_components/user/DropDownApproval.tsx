"use client";

import React, { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveUser, declineUser } from "../../_actions/userActions";
import { toast } from "@/hooks/use-toast";

export default function DropDownApproval({ id }: { id: string }) {
  const [position, setPosition] = React.useState("bottom");
  const [isPending, startTransition] = useTransition();

  const handleAccept = async () => {
    startTransition(async () => {
      try {
        const response = await approveUser(id);

        if (response) {
          toast({
            title: "Success",
            description: "User approved successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to approve user",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error approving position:", error);
      }
    });
  };
  const handleDecline = async () => {
    startTransition(async () => {
      try {
        const response = await declineUser(id);

        if (response) {
          toast({
            title: "Success",
            description: "User declined successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to decline user",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error declining position:", error);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="cursor-pointer text-gray-400 hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-2 p-4">
            <Button disabled={isPending} onClick={handleAccept}>
              Accept
            </Button>
            <Button
              disabled={isPending}
              onClick={handleDecline}
              variant="destructive"
            >
              Decline
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
