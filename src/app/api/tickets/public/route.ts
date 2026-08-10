import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantName, tenantPhone, propertyAddress, title, description, category, priority } = body;

    // Find or create property
    let property = await db.property.findFirst({
      where: { address: { contains: propertyAddress || "" } },
    });

    if (!property) {
      property = await db.property.create({
        data: {
          title: `Property (${propertyAddress || "Default Unit"})`,
          address: propertyAddress || "123 Main Street",
        },
      });
    }

    // Find or create tenant
    let tenant = await db.tenant.findFirst({
      where: { phone: tenantPhone },
    });

    if (!tenant) {
      tenant = await db.tenant.create({
        data: {
          name: tenantName || "Tenant",
          phone: tenantPhone || "+15550192834",
          propertyId: property.id,
        },
      });
    }

    // Create the ticket
    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        category: category || "General",
        priority: priority || "HIGH",
        status: "OPEN",
        propertyId: property.id,
        tenantId: tenant.id,
      },
      include: { property: true, tenant: true },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
