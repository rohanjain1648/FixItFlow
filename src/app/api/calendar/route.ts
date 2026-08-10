import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const confirmedTickets = await db.ticket.findMany({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        calendarEventId: { not: null },
      },
      include: {
        property: true,
        tenant: true,
        selectedContractor: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(confirmedTickets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
