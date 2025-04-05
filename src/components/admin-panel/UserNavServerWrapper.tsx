// // app/components/UserNavServerWrapper.tsx
// "use server";

// import { headers } from "next/headers";
// import UserNav from ""; // Your client component
// import { auth } from "../../../lib/auth";

// export default async function UserNavServerWrapper() {
//   const session = await auth.api.getSession({
//     headers: await headers()
//   });

//   const user = session?.user;
//   const name = user?.name || "Unknown User";
//   const email = user?.email || "";
//   const initials = formatName(name);

//   return <UserNav name={name} email={email} initials={initials} />;
// }

// function formatName(name: string): string {
//   const words = name.trim().split(/\s+/);

//   if (words.length === 1) {
//     return words[0].substring(0, 2).toUpperCase();
//   }

//   const firstInitial = words[0][0];
//   const lastInitial = words[words.length - 1][0];

//   return (firstInitial + lastInitial).toUpperCase();
// }
