"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { changeUserRole, deleteUser } from "../../_actions/userActions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DeleteDialog } from "./DeleteDialog";

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
        const { success, message } = await changeUserRole(id, newRole);

        toast({
          title: success ? "Success" : "Error",
          description: message,
          variant: success ? "default" : "destructive",
        });
      } catch (error) {
        console.error("Unexpected error updating user role:", error);
        toast({
          title: "Unexpected Error",
          description: "Something went wrong while updating the role.",
          variant: "destructive",
        });
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
          <Separator className="my-2" />
          <div className="mt-2 w-full border-t border-gray-200 pt-3">
            <DeleteDialog userId={id}>
              <button>Delete</button>
            </DeleteDialog>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
