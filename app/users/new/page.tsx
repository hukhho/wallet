// // import prisma from "@/lib/prisma";
// // import { revalidatePath } from "next/cache";
// // import { redirect } from "next/navigation";

// // // const https = require("https");
// // import https from "https";

// // // const crypto = require("crypto");
// // import crypto from "crypto";

// // const appId = "6HUlh3lbRQbEYFK1";
// // const appSecret = "5d26129a1b7d13cb0b45b69597512a2f";

// // export default function NewUser() {
// //   async function createUser(formData: FormData) {
// //     "use server";

// //     const userId = formData.get("userId") as string;

// //     // Create the user using

// //     // const path = 'https://ccpayment.com/ccpayment/v2/getOrCreateUserDepositAddress';
// //     // const args = JSON.stringify({'userId': '00001','chain':'BSC', });

// //     // const timestamp = Math.floor(Date.now() / 1000);
// //     // let signText = appId + timestamp;
// //     // if (args) {
// //     //   signText += args;
// //     // }

// //     // const sign = crypto
// //     //   .createHmac('sha256', appSecret)
// //     //   .update(signText)
// //     //   .digest('hex');

// //     // const options = {
// //     //   method: 'POST',
// //     //   headers: {
// //     //     'Content-Type': 'application/json',
// //     //     'Appid': appId,
// //     //     'Sign': sign,
// //     //     'Timestamp': timestamp.toString(),
// //     //   },
// //     // };

// //     // const req = https.request(path, options, (res) => {
// //     //   let respData = '';

// //     //   res.on('data', (chunk) => {
// //     //     respData += chunk;
// //     //   });

// //     //   res.on('end', () => {
// //     //     console.log('Response:', respData);
// //     //   });
// //     // });

// //     // req.write(args);
// //     // req.end();

// //     // await prisma.user.create({
// //     //   data: {
// //     //     userId,
// //     //     assetUSDT,
// //     //     address,
// //     //   },
// //     // });

// //     revalidatePath("/users");
// //     redirect("/users");
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-6">Create New User</h1>
// //       <form action={createUser} className="space-y-6">
// //         <div>
// //           <label htmlFor="userId" className="block text-lg mb-2">
// //             User ID
// //           </label>
// //           <input
// //             type="text"
// //             id="userId"
// //             name="userId"
// //             placeholder="Enter user ID"
// //             className="w-full px-4 py-2 border rounded-lg"
// //             required
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
// //         >
// //           Create User
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import axios from "axios";

// import prisma from "@/lib/prisma";

// export default function GetDepositAddress() {
//   const [userId, setUserId] = useState("");
//   const [chain, setChain] = useState("BSC");
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState("");

//   async function handleSubmit(event: React.FormEvent) {
//     event.preventDefault();
//     setError("");
//     setResponse(null);

//     try {
//       const res = await axios.post("/api/get-deposit-address", {
//         userId,
//         chain,
//       });
//       console.log("API Response:", res.data);
//       console.log("res.data.data.address: ", res.data.data.address);

//       const depositAddress = res.data.data.address;
//       console.log("Deposit Address:", depositAddress);

//       // ✅ Send userId & address to the server to store in Prisma
//       await axios.post("/api/save-user", {
//         userId,
//         assetUSDT: "", // Default USDT balance
//         address: depositAddress,
//       });

//       setResponse(res.data);
//     } catch (err: any) {
//       console.error("Error:", err.response?.data || err.message);
//       setError("Failed to get deposit address");
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Get Deposit Address</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="userId" className="block text-lg mb-2">
//             User ID
//           </label>
//           <input
//             type="text"
//             id="userId"
//             name="userId"
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             placeholder="Enter user ID"
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="chain" className="block text-lg mb-2">
//             Blockchain
//           </label>
//           <select
//             id="chain"
//             name="chain"
//             value={chain}
//             onChange={(e) => setChain(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//           >
//             <option value="BSC">BSC</option>
//             <option value="ETH">Ethereum</option>
//             <option value="TRX">Tron</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
//         >
//           Get Deposit Address
//         </button>
//       </form>

//       {response && (
//         <div className="mt-6 p-4 bg-gray-100 rounded-lg">
//           <h2 className="text-lg font-bold">Deposit Address:</h2>
//           <p className="text-gray-700">{JSON.stringify(response, null, 2)}</p>
//         </div>
//       )}

//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import axios from "axios";

export default function BulkGetDepositAddress() {
  const [userIds, setUserIds] = useState("");
  const [chain, setChain] = useState("BSC");
  const [responses, setResponses] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResponses([]);
    setLoading(true);

    const userList = userIds
      .split("\n")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    if (userList.length === 0) {
      setError("Please enter at least one user ID.");
      setLoading(false);
      return;
    }

    try {
      const results = [];
      for (const userId of userList) {
        try {
          const res = await axios.post("/api/get-deposit-address", {
            userId,
            chain,
          });

          const depositAddress = res.data.data.address;
          console.log(`Deposit Address for ${userId}:`, depositAddress);

          // ✅ Save user details to Prisma
          await axios.post("/api/save-user", {
            userId,
            assetUSDT: "", // Default USDT balance
            address: depositAddress,
          });

          results.push({ userId, address: depositAddress, status: "Success" });
        } catch (err: any) {
          console.error(`Error for ${userId}:`, err.response?.data || err.message);
          results.push({ userId, address: "N/A", status: "Error fetching deposit address" });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay between requests
      }

      setResponses(results);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process bulk deposit address requests.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Bulk Get Deposit Addresses</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userIds" className="block text-lg mb-2">
            User IDs (One per line)
          </label>
          <textarea
            id="userIds"
            name="userIds"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            placeholder="Enter user IDs, one per line"
            rows={6}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="chain" className="block text-lg mb-2">
            Blockchain
          </label>
          <select
            id="chain"
            name="chain"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="BSC">BSC</option>
          
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Deposit Addresses"}
        </button>
      </form>

      {responses.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Results:</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2">Deposit Address</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((res, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{res.userId}</td>
                  <td className="border border-gray-300 px-4 py-2">{res.address}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      res.status === "Success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {res.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
