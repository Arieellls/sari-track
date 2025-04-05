"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addProduct } from "../../_actions/addProducts"; // Adjust this import path as needed
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters."
  }),
  barcode: z.string().min(1, {
    message: "Barcode is required."
  }),
  // You could add additional validation like:
  // .regex(/^[0-9]{12,13}$/, {
  //   message: "Barcode must be 12-13 digits."
  // })
  quantity: z.coerce
    .number()
    .min(1, {
      message: "Quantity must be at least 1."
    })
    .max(1000, {
      message: "Quantity must be at most 1000."
    }),
  expirationDate: z.string().min(1, {
    message: "Expiration date is required."
  })
});

export function AddProductForm({
  closeDialog,
  onSuccess
}: {
  closeDialog: () => void;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      barcode: "",
      quantity: 1, // Change from undefined to empty string
      expirationDate: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await addProduct(data);

      // Check if the result contains an error
      if (result && "error" in result) {
        if (result.error === "DUPLICATE_BARCODE") {
          console.log("Duplicate barcode detected");
          toast({
            title: "Duplicate Barcode",
            description:
              "This barcode is already in use. Please enter a unique barcode.",
            variant: "destructive"
          });

          // Highlight the barcode field as having an error
          form.setError("barcode", {
            type: "manual",
            message: "This barcode is already in use"
          });
        } else {
          toast({
            title: "Error",
            description:
              result.message || "Failed to add product. Please try again.",
            variant: "destructive"
          });
        }
        return; // Stop processing after error
      }

      // Success case
      toast({
        title: "Product Added",
        description: `${data.productName} has been successfully added.`
      });

      form.reset();
      closeDialog();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Exception occurred:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    form.reset();
    closeDialog();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 text-left"
      >
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lay's Classic Chips" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="100101011223" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter quantity (1-1000)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end pt-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
