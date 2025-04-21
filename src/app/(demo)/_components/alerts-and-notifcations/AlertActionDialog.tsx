import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  updateProductQuantity,
  updateProductExpiry,
} from "../../_actions/getProducts";
import { useToast } from "@/hooks/use-toast";

type AlertActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity?: number;
  expiryDate?: string;
  mode?: "low-stock" | "expiry" | "reorder";
  id: string;
};

// Validation schema
const formSchema = z.object({
  quantity: z
    .number()
    .min(11, { message: "Quantity must be at least 1." })
    .max(1000, { message: "Quantity must be at most 1000." })
    .optional(),
  expiryDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format.",
    })
    .optional(),
});

export function AlertActionDialog({
  id,
  open,
  onOpenChange,
  quantity,
  expiryDate,
  mode = "low-stock", // Default to low-stock if mode is undefined
}: AlertActionDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Store the actual mode value to use throughout the component
  const [currentMode, setCurrentMode] = useState(mode);

  // Log props when they change
  useEffect(() => {
    // Update currentMode when mode prop changes
    setCurrentMode(mode);
  }, [id, open, quantity, expiryDate, mode]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: quantity || 1,
      expiryDate: expiryDate || "",
    },
  });

  // Update form values when props change or dialog opens
  useEffect(() => {
    if (open) {
      console.log("Dialog opened with mode:", currentMode);
      form.reset({
        quantity: quantity || 1,
        expiryDate: expiryDate || "",
      });
      setIsSubmitting(false);
    }
  }, [open, quantity, expiryDate, form, currentMode]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit called with mode:", currentMode);
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring");
      return;
    }

    // Set submitting state
    setIsSubmitting(true);

    try {
      console.log("Submitting form with mode:", currentMode);
      console.log("Form data:", data);
      let response;

      // Make sure we have a valid quantity for low-stock mode
      if (currentMode === "low-stock" || currentMode === "reorder") {
        const quantityValue = data.quantity || 10; // Ensure we have a fallback
        console.log("Updating quantity to:", quantityValue, "for id:", id);

        response = await updateProductQuantity(id, quantityValue);
        console.log("Update quantity response:", response);

        if (response?.success) {
          toast({
            title: "Success",
            description: `Product quantity updated to ${quantityValue}`,
          });
        }
      }
      // Make sure we have a valid date for expiry mode
      else if (currentMode === "expiry" && data.expiryDate) {
        console.log("Updating expiry date to:", data.expiryDate, "for id:", id);

        response = await updateProductExpiry(id, data.expiryDate);
        console.log("Update expiry response:", response);

        if (response?.success) {
          toast({
            title: "Success",
            description: `Product expiry date updated to ${data.expiryDate}`,
          });
        }
      } else {
        console.error("Invalid mode or missing data:", {
          mode: currentMode,
          data,
        });
        throw new Error("Invalid mode or missing data");
      }

      if (!response?.success) {
        throw new Error(String(response?.error || "Update failed."));
      }

      // Close dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error("Error during update:", error);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });

      // Reset submitting state on error to allow retry
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCloseDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentMode === "expiry"
              ? "Update Expiration Date"
              : "Update Product Quantity"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentMode === "expiry"
              ? "Please enter the new expiration date for the product."
              : "Please enter the new quantity for the product (11-1000)."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted, current mode:", currentMode);
              if (!isSubmitting) {
                form.handleSubmit(onSubmit)(e);
              }
            }}
            className="space-y-2 text-left"
          >
            {/* Quantity Input */}
            {currentMode === "low-stock" && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1000"
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Math.max(1, parseInt(e.target.value, 10) || 1);
                          field.onChange(value);
                        }}
                        placeholder="Enter quantity (1-1000)"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Expiry Date Input */}
            {currentMode === "expiry" && (
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Reorder Input */}
            {currentMode === "reorder" && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1000"
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Math.max(1, parseInt(e.target.value, 10) || 1);
                          field.onChange(value);
                        }}
                        placeholder="Enter quantity (1-1000)"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isSubmitting}
                onClick={() => handleCloseDialog()}
                type="button"
              >
                Cancel
              </AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Continue"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
