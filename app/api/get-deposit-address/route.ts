import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";



export async function POST(req: Request) {
  try {
    const { userId, chain } = await req.json();

    if (!userId || !chain) {
      return NextResponse.json({ error: "Missing userId or chain" }, { status: 400 });
    }

    // // ✅ Your API credentials (store these in .env)
    const appId = process.env.CCPAYMENT_APP_ID!;
    const appSecret = process.env.CCPAYMENT_APP_SECRET!;
    const url = "https://ccpayment.com/ccpayment/v2/getOrCreateUserDepositAddress";

    // ✅ Create request payload
    const args = JSON.stringify({ userId, chain });

    // ✅ Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // ✅ Create HMAC-SHA256 signature
    let signText = appId + timestamp + args;
    const sign = crypto.createHmac("sha256", appSecret).update(signText).digest("hex");

    // ✅ Make API request with Axios
    const response = await axios.post(url, args, {
      headers: {
        "Content-Type": "application/json",
        "Appid": appId,
        "Sign": sign,
        "Timestamp": timestamp.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to get deposit address" }, { status: 500 });
  }
}
