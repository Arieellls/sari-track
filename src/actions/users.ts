// "use server";

// import { XataHttpClient } from "drizzle-orm/xata-http";
// import { drizzle } from "drizzle-orm/xata-http";
// import { getXataClient } from "../db/xata-client";
// import { User } from "@/db/schemas";
// import {
//   desc,
//   and,
//   asc,
//   isNotNull,
//   lte,
//   gt,
//   eq,
//   like
// } from "drizzle-orm/expressions";
// import { sql } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { signIn } from "../../auth";

// const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
// const db = drizzle(xata);

// export const login = async (formData: FormData): Promise<string | null> => {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   try {
//     const result = await signIn("credentials", {
//       redirect: false,
//       callbackUrl: "/",
//       email,
//       password
//     });

//     if (result?.error) {
//       return result.error;
//     }
//     revalidatePath("/");
//     return null;
//   } catch (error) {
//     return "An unexpected error occurred. Please try again.";
//   }
// };

// // export async function uploadToCloudinary(file: File): Promise<string> {
// //   const formData = new FormData();
// //   formData.append("file", file);
// //   formData.append("upload_preset", "fgynascv");
// //   formData.append("folder", "hci");

// //   const response = await axios.post(
// //     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
// //     formData
// //   );

// //   return response.data.public_id;
// // }

// // export const registerAccount = async (formData: FormData) => {
// //   const entries = Object.fromEntries(formData.entries());
// //   const result = registerSchema.safeParse(entries);

// //   if (!result.success) {
// //     console.error("Validation failed:", result.error.format());
// //     return result.error.format();
// //   }

// //   const data = result.data;
// //   console.log(data);

// //   try {
// //     const [existingUserByEmail] = await db
// //       .select()
// //       .from(Users)
// //       .where(eq(Users.emailAddress, data.emailAddress));

// //     const [existingUserByUsername] = await db
// //       .select()
// //       .from(Users)
// //       .where(eq(Users.username, data.username));

// //     if (existingUserByEmail || existingUserByUsername) {
// //       console.error("User already exists");
// //       return { error: "User already exists" };
// //     }
// //   } catch (error) {
// //     console.error("Error checking for existing user:", error);
// //     return { error: "An error occurred while checking for existing user" };
// //   }

// //   const hashedPassword = await hash(data.password, 12);

// //   const imageUrl = await uploadToCloudinary(data.imageId);

// //   const id = uuidv4();

// //   const userData = {
// //     id,
// //     username: data.username,
// //     password: hashedPassword,
// //     imageId: imageUrl,
// //     firstName: data.firstName,
// //     lastName: data.lastName,
// //     middleName: data?.middleName,
// //     gender: data.sex || "other",
// //     age: +data.age,
// //     status: data.status,
// //     completeAddress: data.completeAddress,
// //     placeOfBirth: data.placeOfBirth,
// //     emailAddress: data.emailAddress,
// //     formerAddress: data.formerAddress,
// //     currentAddress: data.currentAddress,
// //     role: data.role,
// //     birthday: new Date(data.birthday),
// //     isVoter: Boolean(data.isVoter),
// //     contactNumber: data.contactNumber,
// //     position: "",
// //     purok: +data.purok,
// //     isApproved: false
// //   };

// //   console.log(userData);

// //   try {
// //     await db.insert(Users).values(userData);
// //   } catch (error) {
// //     console.error("Error inserting new user:", error);
// //     return { error: "An error occurred while inserting the new user" };
// //   }
// // };

// export const checkUser = async (email: string) => {
//   try {
//     const [user] = await db
//       .select()
//       .from(User)
//       .where(eq(User.email, email))
//       .execute();

//     return user || null;
//   } catch (error) {
//     console.error("Error checking user:", error);
//     return null;
//   }
// };
