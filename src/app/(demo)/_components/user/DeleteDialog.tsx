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
        const response = await deleteUser(userId);

        if (response) {
          toast({
            title: "Success",
            description: "User deleted successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete user",
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
