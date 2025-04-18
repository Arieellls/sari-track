import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { Barcode, FolderClock, PackageOpen, SendToBack } from "lucide-react";
import { AlertActionDialog } from "../alerts-and-notifcations/AlertActionDialog";

type ProductTileProps = {
  id: string;
  name: string;
  quantity: number;
  expires: string;
  destructive?: boolean;
  onClick?: () => void;
  section?: string;
  barcode?: string;
};

export default function ProductTile({
  id,
  name,
  quantity,
  expires,
  barcode,
  destructive = false,
  onClick,
  section = "all",
}: ProductTileProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Log the mode being set when opening the dialog
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card onClick from triggering
    console.log("Opening dialog with section:", section);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className={`flex min-h-[150px] w-full flex-col overflow-hidden rounded-lg shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md sm:w-[250px] ${
          destructive
            ? "bg-red-50 dark:bg-red-200"
            : "bg-white dark:bg-gray-200"
        } ${section === "expiry" ? "bg-yellow-50 dark:bg-yellow-100" : ""} ${section === "reorder" ? "bg-blue-50 dark:bg-blue-200" : ""} ${section === "all" ? "cursor-pointer" : ""}`}
        onClick={onClick}
      >
        <CardHeader
          className={`p-3 ${
            destructive
              ? "bg-red-100 dark:bg-red-700"
              : "bg-gray-100 dark:bg-gray-400"
          } ${section === "low-stock" ? "bg-red-100 dark:bg-red-300" : ""} ${section === "expiry" ? "bg-yellow-100 dark:bg-yellow-200" : ""} ${section === "reorder" ? "bg-blue-100 dark:bg-blue-300" : ""}`}
        >
          <CardTitle
            className={`text-xl ${
              name.length > 30
                ? "text-sm"
                : name.length > 20
                  ? "text-lg"
                  : "text-xl"
            } dark:text-gray-800`}
          >
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full flex-col justify-between p-3">
          <div className="flex items-center justify-between">
            <p className="text-gray-800 dark:text-gray-800">
              {(section === "low-stock" ||
                section === "all" ||
                section === "reorder") && (
                <>
                  Quantity: {quantity} <br />
                </>
              )}
              {section !== "low-stock" &&
                section !== "reorder" &&
                `Expires: ${formatDate(expires)}`}
            </p>
            {section === "low-stock" && (
              <PackageOpen
                onClick={handleIconClick}
                color="#312d2d"
                className="cursor-pointer dark:text-white"
              />
            )}
            {section === "expiry" && (
              <FolderClock
                onClick={handleIconClick}
                color="#312d2d"
                className="cursor-pointer dark:text-white"
              />
            )}
            {section === "reorder" && (
              <SendToBack
                onClick={handleIconClick}
                color="#312d2d"
                className="cursor-pointer dark:text-white"
              />
            )}
          </div>
          {(section === "expiry" ||
            section === "low-stock" ||
            section === "all") && (
            <div className="mt-3 flex w-full justify-start gap-2 text-gray-500">
              <Barcode />
              {barcode}
            </div>
          )}

          {section === "reorder" && (
            <div className="flex w-full justify-end gap-2 text-gray-700">
              <span className="flex cursor-pointer items-center justify-center rounded-lg bg-green-400 px-3 py-[2px] text-[10px] text-sm uppercase">
                Accept
              </span>
              <span className="flex cursor-pointer items-center justify-center rounded-lg bg-red-400 px-3 py-[2px] text-[10px] text-sm uppercase">
                Decline
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog with explicit mode setting */}
      <AlertActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={
          section === "expiry"
            ? "expiry"
            : section === "low-stock"
              ? "low-stock"
              : section === "reorder"
                ? "reorder"
                : undefined
        }
        quantity={quantity}
        expiryDate={expires}
        id={id}
      />
    </>
  );
}
