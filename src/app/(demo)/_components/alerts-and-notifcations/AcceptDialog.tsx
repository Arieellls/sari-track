"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { addReorder } from "../../_actions/reorder";
import { toast } from "@/hooks/use-toast";

type FormData = {
  remarks: string;
};

export function AcceptDialog({
  children,
  product,
}: {
  children: React.ReactNode;
  product: { id: string }; // typing only id for now, adjust as needed
}) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await addReorder({
        product_id: product.id,
        remarks: data.remarks || "",
        status: "accepted",
      });

      if (!res.error) {
        toast({
          title: "Reorder Successful",
          description: "Your reorder has been successfully placed.",
          variant: "default",
        });
        reset();
      } else {
        toast({
          title: "Reorder Failed",
          description:
            res.message || "An error occurred while placing the reorder.",
          variant: "destructive",
        });
        console.error(res.message);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          asChild
          className="rounded border border-emerald-500 bg-transparent px-6 py-1 text-sm text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
        >
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 rounded-lg sm:w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reorder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reorder this product? This action will
              place a new order based on the previous one.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-3">
            <label
              htmlFor="remarks"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Remarks (optional)
            </label>
            <Textarea
              id="remarks"
              placeholder="Add any remarks for this reorder..."
              {...register("remarks")}
              className="mb-2"
              rows={4}
              disabled={isPending}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center"
              >
                {isPending ? "Submitting..." : "Continue"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
