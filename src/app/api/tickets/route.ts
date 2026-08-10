import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tickets = await db.ticket.findMany({
      include: {
        property: true,
        tenant: true,
        selectedContractor: true,
        callLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, priority, propertyId, tenantId } = body;

    const newTicket = await db.ticket.create({
      data: {
        title,
        description,
        category: category || "General",
        priority: priority || "MEDIUM",
        status: "OPEN",
        propertyId,
        tenantId,
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
