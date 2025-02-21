"use client";

import { useState } from "react";
import axios from "axios";

export default function AutoTransferFunds() {
  const [fromUserId, setFromUserId] = useState("");
  const [coinId, setCoinId] = useState(1280); // Default Coin ID
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleTransfer(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await axios.post("/api/auto-transfer", { fromUserId, coinId });
      console.log("Auto Transfer Response:", res.data);
      setResult(res.data);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to process transfer");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Auto Transfer Funds</h1>
      <form onSubmit={handleTransfer} className="space-y-6">
        <div>
          <label htmlFor="fromUserId" className="block text-lg mb-2">User ID (From)</label>
          <input
            type="text"
            id="fromUserId"
            name="fromUserId"
            value={fromUserId}
            onChange={(e) => setFromUserId(e.target.value)}
            placeholder="Enter sender user ID"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Transfer Funds
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold">Transfer Result:</h2>
          <p className="text-gray-700">{JSON.stringify(result, null, 2)}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
