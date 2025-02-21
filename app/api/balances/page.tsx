"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function UserBalances() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await axios.get("/api/get-all-balances");
        setBalances(res.data.balances);
      } catch (err: any) {
        console.error("Error fetching balances:", err);
        setError("Failed to load balances.");
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Balances</h1>

      {loading && <p className="text-gray-600">Loading balances...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && balances.length === 0 && <p className="text-gray-600">No balances found.</p>}

      {!loading && balances.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((user: any) => (
                <tr key={user.userId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{user.userId}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
