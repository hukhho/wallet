import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId, coinId, address, chain } = await req.json();

    if (!userId || !coinId || !address || !chain) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // ✅ CCPayment API credentials (store in .env)
    const appId = process.env.CCPAYMENT_APP_ID!;
    const appSecret = process.env.CCPAYMENT_APP_SECRET!;
    const balanceUrl = "https://ccpayment.com/ccpayment/v2/getUserCoinAsset";
    const withdrawUrl =
      "https://ccpayment.com/ccpayment/v2/applyUserWithdrawToNetwork";

    // ✅ Step 1: Check User Balance
    const balanceArgs = JSON.stringify({ userId, coinId });
    const timestamp = Math.floor(Date.now() / 1000);
    let balanceSignText = appId + timestamp + balanceArgs;
    const balanceSign = crypto
      .createHmac("sha256", appSecret)
      .update(balanceSignText)
      .digest("hex");

    const balanceResponse = await axios.post(balanceUrl, balanceArgs, {
      headers: {
        "Content-Type": "application/json",
        Appid: appId,
        Sign: balanceSign,
        Timestamp: timestamp.toString(),
      },
    });

    const balance = balanceResponse.data.data.asset.available;
    console.log("balance:", balance);

    if (
      !balance ||
      balance <= 10
    ) {
      return NextResponse.json({
        success: false,
        message: "Balance is too low for withdrawal",
      });
    }

    const amountToWithdraw = balance; // ✅ Withdraw full balance if > 20

    // ✅ Step 2: Withdraw All Funds if Balance > 20
    const orderId = Date.now().toString(); // Unique Order ID
    const withdrawArgs = JSON.stringify({
      coinId,
      address,
      orderId,
      userId,
      chain,
      amount: amountToWithdraw.toString(),
      merchantPayNetworkFee: false,
    });

    let withdrawSignText = appId + timestamp + withdrawArgs;
    const withdrawSign = crypto
      .createHmac("sha256", appSecret)
      .update(withdrawSignText)
      .digest("hex");

    const withdrawResponse = await axios.post(withdrawUrl, withdrawArgs, {
      headers: {
        "Content-Type": "application/json",
        Appid: appId,
        Sign: withdrawSign,
        Timestamp: timestamp.toString(),
      },
    });

    console.log("Withdraw Response:", withdrawResponse.data);
    return NextResponse.json(withdrawResponse.data);
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}
