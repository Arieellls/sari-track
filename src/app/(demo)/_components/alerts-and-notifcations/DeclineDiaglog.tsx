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
import { addReorder } from "../../_actions/reorder";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  remarks: string;
};

export function DeclineDialog({
  children,
  className,
  product,
}: {
  children: React.ReactNode;
  className?: string;
  product: { id: string }; // typing only id for now, adjust as needed
}) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await addReorder({
        product_id: product.id,
        remarks: data.remarks || "",
        status: "declined",
      });

      if (!res.error) {
        toast({
          title: "Decline Successful",
          description: "The request has been successfully declined.",
          variant: "default",
        });
        reset();
      } else {
        toast({
          title: "Decline Failed",
          description:
            res.message || "An error occurred while declining the request.",
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
          variant="outline"
          className={`bg-transparent ${className}`}
        >
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 rounded-lg sm:w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Reorder Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this product reorder? This action
              cannot be undone and the reorder request will be permanently
              dismissed.
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
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              asChild
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 dark:hover:bg-destructive/80"
            >
              <button type="submit" disabled={isPending}>
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
