import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { UpdateProductForm } from "./UpdateProductForm";

export function UpdateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="flex flex-row-reverse gap-2"
          variant="default"
          onClick={() => setOpen(true)}
        >
          Update Product
          <ScanBarcode width={17} height={17} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 rounded-lg sm:w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Product</AlertDialogTitle>
          <AlertDialogDescription>
            Modify the details below to update the product in your inventory.
          </AlertDialogDescription>
          <UpdateProductForm closeDialog={() => setOpen(false)} />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
