import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calendarService } from "@/lib/calendar";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { property: true, tenant: true, selectedContractor: true },
    });

    if (!ticket || !ticket.selectedContractor) {
      return NextResponse.json({ error: "Confirmed ticket not found" }, { status: 404 });
    }

    const event = await calendarService.createEvent({
      ticketId: ticket.id,
      title: ticket.title,
      description: ticket.description,
      location: ticket.property.address,
      tenantName: ticket.tenant.name,
      contractorName: ticket.selectedContractor.name,
      scheduledAt: ticket.scheduledAt || "Today",
    });

    return new NextResponse(event.icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="fixitflow-appointment-${ticketId}.ics"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
