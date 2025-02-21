import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Fetch all users from the database
    const users = await prisma.user.findMany();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}