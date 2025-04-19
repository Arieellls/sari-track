"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useTransition } from "react";

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
import { addProduct, updateProduct } from "../../_actions/addProducts";
import { toast } from "@/hooks/use-toast";
import { ScanBarcode } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import dynamic from "next/dynamic";
import { getProductById } from "../../_actions/getProducts";

const QRScanner = dynamic(() => import("./BarcodeScanner"), { ssr: false });

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  barcode: z.string().min(1, {
    message: "Barcode is required.",
  }),
  quantity: z.coerce
    .number()
    .min(1, {
      message: "Quantity must be at least 1.",
    })
    .max(1000, {
      message: "Quantity must be at most 1000.",
    }),
  expirationDate: z.string().min(1, {
    message: "Expiration date is required.",
  }),
});

export function UpdateProductForm({
  closeDialog,
  onSuccess,
}: {
  closeDialog: () => void;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [id, setId] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      barcode: "",
      quantity: 1,
      expirationDate: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (id) {
      startTransition(async () => {
        const response = await updateProduct(id, barcode, {
          productName: data.productName,
          quantity: data.quantity,
          expirationDate: data.expirationDate,
          newBarcode: data.barcode,
        });

        if (response && "error" in response) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Success",
            description: "Product updated successfully.",
          });
          setIsSubmitting(false);
          form.reset();
          closeDialog();
          onSuccess?.();
        }
      });
    } else {
      toast({
        title: "Error",
        description: "Product ID is missing.",
        variant: "destructive",
      });
    }
  };

  const onClose = () => {
    form.reset();
    closeDialog();
  };

  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const handleBarcodeScan = async (barcodeData: string) => {
    const product = await getProductById(barcodeData);

    if (product && "error" in product) {
      toast({
        title: "Error",
        description: product.error,
        variant: "destructive",
      });
      return;
    }

    if (product && product.data) {
      setId(product.data.id);
      setBarcode(product.data.barcode ?? "");
      form.setValue("barcode", barcodeData);
      form.setValue("productName", product.data.name ?? "");
      form.setValue("quantity", product.data.quantity ?? 0);
      form.setValue(
        "expirationDate",
        product.data.expiresAt
          ? product.data.expiresAt.toISOString().split("T")[0]
          : "",
      );
    } else {
      toast({
        title: "Product Not Found",
        description: "No product found with this barcode.",
        variant: "destructive",
      });
    }

    // Close the scanner dialog
    closeScanner();
  };

  const handleManualEntry = () => {
    closeScanner();
  };

  return (
    <>
      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 text-left"
        >
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
          <div className="flex w-full flex-col items-center justify-between gap-2 py-3">
            <Button
              variant="outline"
              type="button"
              onClick={openScanner}
              className="flex w-full items-center gap-2"
            >
              <ScanBarcode width={20} height={20} />
              Scan Barcode
            </Button>
            <div className="flex w-full justify-between gap-2">
              <Button
                className="w-[50%]"
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button className="w-[50%]" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Scanner Dialog - keeping the same structure as the working version */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="w-96 rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan Product Barcode</DialogTitle>
          </DialogHeader>
          <QRScanner onScan={handleBarcodeScan} onClose={closeScanner} />
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={closeScanner}>
              Cancel
            </Button>
            <Button onClick={handleManualEntry}>Enter Manually</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
