import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, assetUSDT, address } = await req.json();

    if (!userId || !address) {
      return NextResponse.json({ error: "Missing userId or address" }, { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists", user: existingUser });
    }

    // ✅ Create the user if they don’t exist
    const user = await prisma.user.create({
      data: { userId, assetUSDT, address },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}
