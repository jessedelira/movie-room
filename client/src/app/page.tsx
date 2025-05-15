"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Index = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && user) {
    router.push("/home");
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="mb-8 text-3xl font-bold">Chicago Admin</h1>
      <div className="mb-8 flex gap-4">
        <button
          className="rounded border bg-blue-500 px-4 py-2 text-white"
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </button>
        <button
          className="rounded border bg-green-500 px-4 py-2 text-white"
          onClick={() => (window.location.href = "/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Index;
