import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DropDownUsers from "./DropDownUsers";
import {
  getAllUsers,
  getAllUsersNeedsApproval,
} from "../../_actions/userActions";
import { formatRole } from "@/lib/formatRole";
import Image from "next/image";
import DropDownApproval from "./DropDownApproval";
import ImageCover from "../account/Image";
import { useUserStore } from "@/hooks/useUserStore";
import { getUser, getUserRole } from "../../../../../server/user";

export async function UserPage() {
  const fetchedUser = await getUser();
  const userDetails = await getUserRole(fetchedUser?.email ?? "");
  const role = userDetails?.role ?? "";

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-xl font-semibold">Registered Users</h2>
      <Users role={role} />

      <h2 className="mt-5 text-xl font-semibold">Pending Approvals</h2>
      <UsersNeedsApproval role={role} />
    </div>
  );
}

async function Users({ role }: { role: string }) {
  const users = await getAllUsers();

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
          <TableHead className=""></TableHead>
          <TableHead className="flex sm:hidden"></TableHead>
          <TableHead className="">Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden w-[50px] text-center sm:table-cell"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            {/* Mobile actions */}
            {(role === "admin" || role === "owner") && (
              <TableCell className="text-center sm:hidden">
                <DropDownUsers id={user.id} userPosition={user.role} />
              </TableCell>
            )}

            <TableCell className="flex w-fit font-medium">
              {user?.image?.includes("googleusercontent.com") ? (
                <Image
                  src={user.image}
                  alt="User Image"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : user?.image ? (
                <ImageCover
                  publicId={user.image}
                  className="rounded-full"
                  size={24}
                />
              ) : (
                <Image
                  src="/user.png"
                  alt="Default User Image"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="w-fit">{formatRole(user.role)}</TableCell>
            {(role === "admin" || role === "owner") && (
              <TableCell className="hidden text-center sm:table-cell">
                <DropDownUsers id={user.id} userPosition={user.role} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

async function UsersNeedsApproval({ role }: { role: string }) {
  const users = await getAllUsersNeedsApproval();

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
          <TableHead className="flex sm:hidden"></TableHead>
          <TableHead className=""></TableHead>
          <TableHead className="">Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden w-[50px] text-center sm:table-cell"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            {/* Mobile actions */}
            {(role === "admin" || role === "owner") && (
              <TableCell className="text-center sm:hidden">
                <DropDownApproval id={user.id} />
              </TableCell>
            )}

            <TableCell className="flex w-fit font-medium">
              <Image
                src={user.image ?? "/user.png"}
                alt="User Image"
                width={24}
                height={24}
                className="rounded-full"
              />
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="w-fit">{formatRole(user.role)}</TableCell>
            {(role === "admin" || role === "owner") && (
              <TableCell className="hidden text-center sm:table-cell">
                <DropDownApproval id={user.id} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
