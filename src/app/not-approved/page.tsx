// app/not-approved/page.tsx
import Link from "next/link";

const NotApprovedPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-red-600">
          Account Not Approved
        </h1>
        <p className="mb-6 text-gray-700">
          Your account is currently pending approval by the administrator.
          Please check back later or contact support for more information.
        </p>
        <Link
          href="/login"
          className="font-medium text-blue-600 transition hover:underline"
        >
          Return to Login Page
        </Link>
      </div>
    </main>
  );
};

export default NotApprovedPage;
