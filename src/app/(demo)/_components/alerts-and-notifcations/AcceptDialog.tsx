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

export function AcceptDialog({ children }: { children: React.ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button asChild className="bg-transparent">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 rounded-lg sm:w-[500px]">
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
            className="mb-2"
            placeholder="Add any remarks for this reorder..."
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
