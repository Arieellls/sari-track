"use";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { deleteUser } from "../../_actions/userActions";
import { toast } from "@/hooks/use-toast";

type DeleteUserResponse = { success: boolean; error?: string };

export function DeleteDialog({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response: DeleteUserResponse = await deleteUser(userId);

        if (response.success) {
          toast({
            title: "Success",
            description: "User deleted successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: response.error || "An unknown error occurred",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full">
        <Button asChild variant="destructive" className="w-full">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            account and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
