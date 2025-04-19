import { AlertCircle, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AcceptDialog } from "./AcceptDialog";

// export default function AutomatedSuggestions() {
//   return (
//     <div className="flex w-full flex-col gap-4">
//       <SuggestionCard status="pending" />
//       <SuggestionCard status="accepted" />
//       <SuggestionCard status="declined" />
//     </div>
//   );
// }
interface Product {
  id: string;
  name: string | null;
  barcode?: string | null;
  quantity: number | null;
  expiresAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export default function AutomatedSuggestions({
  product,
  status,
}: {
  product: Product;
  status: "pending" | "accepted" | "declined";
}) {
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);

  const statusConfig = {
    pending: {
      icon: <AlertCircle size={16} className="text-amber-500" />,
      label: "Pending",
      color: "text-amber-500",
      borderColor: "bg-amber-500",
      remarks: "",
    },
    accepted: {
      icon: <Check size={16} className="text-emerald-500" />,
      label: "Accepted",
      color: "text-emerald-500",
      borderColor: "bg-emerald-500",
      remarks:
        "Stock will be replenished automatically. Supplier has been notified and order #A12345 has been confirmed. Expected delivery in 3-5 business days.",
    },
    declined: {
      icon: <X size={16} className="text-rose-500" />,
      label: "Declined",
      color: "text-rose-500",
      borderColor: "bg-rose-500",
      remarks:
        "Declined due to existing order in progress. Stock will be replenished through order #B78901 placed on Apr 15. Expected delivery on Apr 23.",
    },
  };

  const { icon, label, color, borderColor, remarks } = statusConfig[status];

  const toggleRemarks = () => {
    setIsRemarksOpen(!isRemarksOpen);
  };

  const showRemarksToggle = status === "accepted" || status === "declined";

  return (
    <div className="flex w-full overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-md dark:hover:shadow-lg">
      <div className={`w-1 ${borderColor}`}></div>
      <div className="flex-1 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
          <div
            className={`flex items-center gap-1 ${color} text-xs font-medium`}
          >
            {icon}
            <span>{label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Inventory is below threshold levels.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Current quantity:{" "}
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {product.quantity}
              </span>
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Last re-order: hahahaha
            </span>
          </div>
        </div>

        {showRemarksToggle && (
          <button
            onClick={toggleRemarks}
            className="mt-3 flex items-center text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isRemarksOpen ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Hide remarks
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Show remarks
              </>
            )}
          </button>
        )}

        {showRemarksToggle && isRemarksOpen && (
          <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
            <p>{remarks}</p>
          </div>
        )}

        {status === "pending" && (
          <div className="mt-3 flex justify-end gap-3">
            <AcceptDialog>
              <button className="rounded border border-emerald-500 px-6 py-1 text-sm text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                Accept
              </button>
            </AcceptDialog>
            <button className="rounded border border-rose-500 px-6 py-1 text-sm text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/30">
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
