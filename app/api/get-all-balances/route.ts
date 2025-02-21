import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ✅ Get all users from the database
    const users = await prisma.user.findMany();

    if (!users.length) {
      return NextResponse.json({ success: false, message: "No users found" });
    }

    // ✅ CCPayment API credentials
    const appId = process.env.CCPAYMENT_APP_ID!;
    const appSecret = process.env.CCPAYMENT_APP_SECRET!;
    const url = "https://ccpayment.com/ccpayment/v2/getUserCoinAsset";
    const coinId = 1280; // Default coin ID

    // ✅ Prepare requests for all users
    const requests = users.map(async (user) => {
      const args = JSON.stringify({ userId: user.userId, coinId });
      const timestamp = Math.floor(Date.now() / 1000);
      let signText = appId + timestamp + args;
      const sign = crypto.createHmac("sha256", appSecret).update(signText).digest("hex");

      try {
        const response = await axios.post(url, args, {
          headers: {
            "Content-Type": "application/json",
            "Appid": appId,
            "Sign": sign,
            "Timestamp": timestamp.toString(),
          },
        });

        return {
          userId: user.userId,
          balance: response.data.data.balance || 0,
        };
      } catch (error) {
        console.error(`Error fetching balance for user ${user.userId}:`, error);
        return {
          userId: user.userId,
          balance: "Error fetching balance",
        };
      }
    });

    // ✅ Wait for all balance requests to complete
    const balances = await Promise.all(requests);

    return NextResponse.json({ success: true, balances });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch balances" }, { status: 500 });
  }
}
