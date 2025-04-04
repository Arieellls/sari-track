import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";

type ProductTileProps = {
  name: string;
  quantity: number;
  expires: string;
  destructive?: boolean;
  onClick?: () => void; // Add this prop
};

export default function ProductTile({
  name,
  quantity,
  expires,
  destructive = false,
  onClick
}: ProductTileProps) {
  return (
    <Card
      className={`w-full h-[150px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out overflow-hidden cursor-pointer sm:w-[250px] ${
        destructive ? "bg-red-50" : "bg-white"
      }`}
      onClick={onClick} // Add the onClick handler here
    >
      <CardHeader
        className={`p-3 ${destructive ? "bg-red-100" : "bg-gray-100"}`}
      >
        <CardTitle className={`text-2xl ${name.length > 17 ? "text-xl" : ""}`}>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div>Quantity: {quantity}</div>
        <div>Expires: {formatDate(expires)}</div>
      </CardContent>
    </Card>
  );
}
