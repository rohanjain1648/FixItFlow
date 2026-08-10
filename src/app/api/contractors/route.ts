import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const contractors = await db.contractor.findMany({
      orderBy: { rating: "desc" },
    });
    return NextResponse.json(contractors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newContractor = await db.contractor.create({
      data: body,
    });
    return NextResponse.json(newContractor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
