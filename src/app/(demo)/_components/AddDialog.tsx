import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AddProductForm } from "./inventory/AddProductForm";

export function AddDialog() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[425px] sm:max-w-[500px] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Add a New Product</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below to add a new product to your inventory.
          </AlertDialogDescription>
          <AddProductForm closeDialog={() => setOpen(false)} />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
