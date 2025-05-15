"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [searchResult, setSearchResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get("userId");
	try {
    const response = await fetch(`${process.env.API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
	const data = await response.json();
	setSearchResult(data);
}
catch (error) {
	console.error("Error fetching user:", error);
}


  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-xl rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200 p-10 flex flex-col items-center">
        <h1
          className="text-3xl font-bold mb-6 text-gray-900 tracking-tight"
          style={{
            fontFamily:
              "San Francisco, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
          }}
        >
          macOS Admin Panel
        </h1>
        <p className="mb-6 text-gray-600 text-lg">
          This is a page that only a logged in user should see
        </p>
        <div className="mb-8 flex items-center gap-2 text-gray-700">
          <span className="font-semibold">User ID:</span>
          <span className="bg-gray-200 rounded px-2 py-1 text-xs font-mono">
            {user.id}
          </span>
        </div>
        <div className="mb-8 flex items-center gap-2 text-gray-700">
          <span className="font-semibold">User Name:</span>
          <span className="bg-gray-200 rounded px-2 py-1 text-xs font-mono">
            {user.name}
          </span>
        </div>
        <button
          className="rounded-lg border border-gray-300 bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 px-6 py-3 font-semibold shadow hover:shadow-lg transition mb-8 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <div className="w-full">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 items-center"
          >
            <label className="text-gray-700 font-medium">
              Input user id to search for
            </label>
            <input
              name="userId"
              type="text"
              className="rounded border border-gray-300 px-3 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            />
            <button
              className="mt-2 rounded-lg border border-blue-400 bg-blue-500 text-white px-4 py-2 font-semibold shadow hover:bg-blue-600 transition"
              type="submit"
            >
              Find
            </button>
          </form>
		  { searchResult && (
					<div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
						<h2 className="text-lg font-semibold">Search Result:</h2>
						<p className="mt-2">
							<span className="font-semibold">User ID:</span> {searchResult.id}
						</p>
						<p>			
							<span className="font-semibold">User Name:</span> {searchResult.name}
						</p>
						<p>
							<span className="font-semibold">User Email:</span> {searchResult.email}
						</p>
						<p>		
							<span className="font-semibold">User Created At:</span> {new Date(searchResult.createdAt).toLocaleDateString()}
						</p>
						<p>
							<span className="font-semibold">User Updated At:</span> {new Date(searchResult.updatedAt).toLocaleDateString()}
						</p>
					</div>
				)	
		}
        </div>
      </div>
    </div>
  );
};

export default Home;
