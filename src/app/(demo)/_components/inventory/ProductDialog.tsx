import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { formatDate } from "@/lib/formatDate";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteProduct, updateProduct } from "../../_actions/addProducts";
import { toast } from "@/hooks/use-toast";
import { DeleteDialog } from "./DeleteDialog";

type ProductDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
    id: string;
    name: string;
    quantity: number;
    expiresAt: string;
    barcode?: string;
  };
};

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
  }),
  expirationDateNew: z.string().min(1, {
    message: "Expiration date is required."
  })
});

export function ProductDialog({
  isOpen,
  onOpenChange,
  product
}: ProductDialogProps) {
  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: product?.name || "",
      barcode: product?.barcode || "",
      quantity: product?.quantity || 1,
      expirationDate: product?.expiresAt ? formatDate(product.expiresAt) : "",
      expirationDateNew: ""
    }
  });

  const title =
    mode === "add"
      ? "Add a New Product"
      : mode === "edit"
      ? `Edit ${product?.name}`
      : `Product: ${product?.name}`;

  const description =
    mode === "add"
      ? "Fill in the details below to add a new product to your inventory."
      : mode === "edit"
      ? "Update the product details below."
      : "View product details below.";

  const onEdit = () => {
    console.log("Edit button clicked");
    setMode("edit");
    console.log(mode);
  };

  useEffect(() => {
    if (!isOpen) {
      setMode("view");
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.name || "",
        barcode: product.barcode || "",
        quantity: product.quantity || 1,
        expirationDate: formatDate(product.expiresAt) || "",
        expirationDateNew: ""
      });
    }
  }, [product, form]);

  const onClose = () => {
    form.reset();
  };

  const onSubmit = async (data: any) => {
    if (mode === "edit" && product?.barcode) {
      setLoading(true); // Disable the button and show "Updating..."

      const response = await updateProduct(product.id, product.barcode, {
        newBarcode: data.barcode,
        productName: data.productName,
        quantity: data.quantity,
        expirationDate: data.expirationDateNew || data.expirationDate
      });

      setLoading(false); // Re-enable the button after response

      if (response.error) {
        console.error("Update failed:", response.message);
        return;
      }

      toast({
        title: "Product Updated",
        description: `${data.productName} updated successfully.`
      });

      onOpenChange(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    if (product?.id) {
      const response = await deleteProduct(product.id);

      setLoading(false); // Re-enable the button after response

      if (response.error) {
        console.error("Delete failed:", response.message);
        return;
      }

      toast({
        title: "Product Deleted",
        description: `${product.name} deleted successfully.`
      });

      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[425px] sm:max-w-[500px] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

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
                    <Input
                      {...field}
                      placeholder="e.g. Lay's Classic Chips"
                      disabled={mode === "view"}
                    />
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
                      disabled={mode === "view"}
                    />
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
                    <Input {...field} disabled={mode === "view"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem
                  className={`space-y-1 ${mode === "edit" ? "hidden" : ""}`}
                >
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mode === "view"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationDateNew"
              render={({ field }) => (
                <FormItem
                  className={`space-y-1 ${mode === "view" ? "hidden" : ""}`}
                >
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={mode === "view"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              {mode === "view" ? (
                <div className="flex justify-between mt-3 flex-row-reverse w-full gap-2">
                  <div className="flex gap-2">
                    <AlertDialogCancel disabled={loading} onClick={onClose}>
                      Close
                    </AlertDialogCancel>
                    <Button type="button" disabled={loading} onClick={onEdit}>
                      Edit
                    </Button>
                  </div>
                  <DeleteDialog onDelete={onDelete} loading={loading} />
                </div>
              ) : (
                <div className="flex justify-end mt-3 w-full">
                  <div className="flex gap-2">
                    <AlertDialogCancel disabled={loading}>
                      Cancel
                    </AlertDialogCancel>
                    <Button type="submit" disabled={loading}>
                      {loading
                        ? "Updating..."
                        : mode === "edit"
                        ? "Save Changes"
                        : "Add Product"}
                    </Button>
                  </div>
                </div>
              )}
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
