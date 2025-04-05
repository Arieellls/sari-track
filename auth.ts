// import NextAuth, { DefaultSession } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { compare } from "bcryptjs";
// import { checkUser } from "@/actions/users";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       authorize: async (credentials) => {
//         if (!credentials?.email || typeof credentials.email !== "string") {
//           throw new Error("Email is required and must be a string");
//         }

//         if (
//           !credentials?.password ||
//           typeof credentials.password !== "string"
//         ) {
//           throw new Error("Password is required and must be a string");
//         }

//         try {
//           const user = await checkUser(credentials.email);

//           if (!user) {
//             throw new Error("Invalid email or password");
//           }

//           const isPasswordValid = await compare(
//             credentials.password,
//             user.password
//           );

//           if (!isPasswordValid) {
//             throw new Error("Invalid email or password");
//           }

//           return {
//             id: user.id,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             name: `${user.firstName} ${user?.middleName} ${user.lastName}`
//           };
//         } catch (error) {
//           if (error instanceof Error) {
//             throw new Error(error.message || "Authorization failed");
//           } else {
//             throw new Error("An unknown error occurred");
//           }
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: "/login"
//   },

//   callbacks: {
//     async session({ session, token }) {
//       if (token?.sub) {
//         if (session.user) {
//           session.user.id = token.sub;
//         }
//         session.user.name = token.name || "";
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.name = user.name;
//       }
//       return token;
//     },

//     signIn: async ({ user, account }) => {
//       if (account?.provider === "credentials") {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   }
// });
