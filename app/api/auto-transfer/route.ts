import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { fromUserId, coinId } = await req.json();

    if (!fromUserId || !coinId) {
      return NextResponse.json({ error: "Missing fromUserId or coinId" }, { status: 400 });
    }

    // ✅ CCPayment API credentials
    const appId = process.env.CCPAYMENT_APP_ID!;
    const appSecret = process.env.CCPAYMENT_APP_SECRET!;
    const balanceUrl = "https://ccpayment.com/ccpayment/v2/getUserCoinAsset";
    const transferUrl = "https://ccpayment.com/ccpayment/v2/userTransfer";
    const toUserId = "00001"; // ✅ Destination User ID

    // ✅ Step 1: Check User Balance
    const balanceArgs = JSON.stringify({ userId: fromUserId, coinId });
    const timestamp = Math.floor(Date.now() / 1000);
    let balanceSignText = appId + timestamp + balanceArgs;
    const balanceSign = crypto.createHmac("sha256", appSecret).update(balanceSignText).digest("hex");

    const balanceResponse = await axios.post(balanceUrl, balanceArgs, {
      headers: {
        "Content-Type": "application/json",
        "Appid": appId,
        "Sign": balanceSign,
        "Timestamp": timestamp.toString(),
      },
    });

    const balanceData = balanceResponse.data;
    console.log("Balance Data:", balanceData);

    if (!balanceData.data || balanceData.data.asset.available <= 0) {
      return NextResponse.json({ success: false, message: "No balance available for transfer" });
    }

    const amountToTransfer = balanceData.data.asset.available; // ✅ Transfer full balance
    console.log('amountToTransfer: ', amountToTransfer)
    // ✅ Step 2: Transfer Funds if Balance > 0
    const orderId = Date.now().toString(); // Unique Order ID
    const transferArgs = JSON.stringify({
      coinId,
      fromUserId,
      toUserId,
      orderId,
      amount: amountToTransfer.toString(),
    });

    let transferSignText = appId + timestamp + transferArgs;
    const transferSign = crypto.createHmac("sha256", appSecret).update(transferSignText).digest("hex");

    const transferResponse = await axios.post(transferUrl, transferArgs, {
      headers: {
        "Content-Type": "application/json",
        "Appid": appId,
        "Sign": transferSign,
        "Timestamp": timestamp.toString(),
      },
    });

    console.log("Transfer Response:", transferResponse.data);
    return NextResponse.json(transferResponse.data);
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to process transfer" }, { status: 500 });
  }
}
