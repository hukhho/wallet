"use client";

import { useState } from "react";
import axios from "axios";

export default function GetUserBalance() {
  const [userId, setUserId] = useState("");
  const [coinId, setCoinId] = useState(1280); // Default Coin ID
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBalance(null);

    try {
      const res = await axios.post("/api/get-balance", { userId, coinId });
      console.log("User Balance Response:", res.data);
      setBalance(res.data);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to fetch user balance");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Get User Balance</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-lg mb-2">User ID</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Get Balance
        </button>
      </form>

      {balance && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold">User Balance:</h2>
          <p className="text-gray-700">{JSON.stringify(balance, null, 2)}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
