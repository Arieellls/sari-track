"use client";

import React, { startTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { changeUserRole } from "../../_actions/userActions";
import { toast } from "@/hooks/use-toast";

export default function DropDownUsers({
  id,
  userPosition,
}: {
  id: string;
  userPosition: string;
}) {
  const [position, setPosition] = React.useState(userPosition);
  const [isPending, startTransition] = React.useTransition();

  const handleChange = async (newRole: string) => {
    setPosition(newRole);

    startTransition(async () => {
      try {
        const response = await changeUserRole(id, newRole);

        if (response) {
          toast({
            title: "Success",
            description: "User role updated successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update user role",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating user role:", error);
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
          <DropdownMenuRadioGroup value={position} onValueChange={handleChange}>
            <DropdownMenuRadioItem disabled={isPending} value="staff">
              Staff
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem disabled={isPending} value="cashier">
              Cashier
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem disabled={isPending} value="manager">
              Manager
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem disabled={isPending} value="owner">
              Owner
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
