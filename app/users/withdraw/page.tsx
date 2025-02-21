"use client";

import { useState } from "react";
import axios from "axios";

export default function AutoWithdrawFunds() {
  const [userId] = useState("00001"); // Fixed User ID
  const [coinId] = useState(1280); // Default Coin ID
  const [address, setAddress] = useState(""); // Withdrawal Address
  const [chain, setChain] = useState("POLYGON"); // Default Chain
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await axios.post("/api/auto-withdraw", { userId, coinId, address, chain });
      console.log("Auto Withdraw Response:", res.data);
      setResult(res.data);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to process withdrawal");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Auto Withdraw Funds</h1>
      <form onSubmit={handleWithdraw} className="space-y-6">
        <div>
          <label htmlFor="address" className="block text-lg mb-2">Withdrawal Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter destination address"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
          Withdraw Funds
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold">Withdrawal Result:</h2>
          <p className="text-gray-700">{JSON.stringify(result, null, 2)}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
