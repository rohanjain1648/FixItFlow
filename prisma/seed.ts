import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const dbFile = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbFile}` });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding FixItFlow Database...");

  // Clean existing tables
  await db.callLog.deleteMany();
  await db.ticket.deleteMany();
  await db.tenant.deleteMany();
  await db.property.deleteMany();
  await db.contractor.deleteMany();

  // Create Properties
  const prop1 = await db.property.create({
    data: {
      title: "Sunset Heights Apartments",
      address: "742 Evergreen Terrace, Springfield",
      unit: "Apt 4B",
    },
  });

  const prop2 = await db.property.create({
    data: {
      title: "Grandview Tech Plaza",
      address: "100 Innovation Way, San Jose, CA",
      unit: "Suite 300",
    },
  });

  const prop3 = await db.property.create({
    data: {
      title: "Metropolitan Lofts",
      address: "500 Ocean Boulevard, Miami, FL",
      unit: "Unit 12A",
    },
  });

  // Create Tenants
  const tenant1 = await db.tenant.create({
    data: {
      name: "Sarah Jenkins",
      phone: "+15550192834",
      email: "sarah.j@example.com",
      propertyId: prop1.id,
    },
  });

  const tenant2 = await db.tenant.create({
    data: {
      name: "Marcus Vance",
      phone: "+15550183742",
      email: "m.vance@example.com",
      propertyId: prop2.id,
    },
  });

  const tenant3 = await db.tenant.create({
    data: {
      name: "Elena Rostova",
      phone: "+15550149201",
      email: "elena.r@example.com",
      propertyId: prop3.id,
    },
  });

  // Create Contractors
  const plumber1 = await db.contractor.create({
    data: {
      name: "Apex Plumbing & Drain Solutions",
      phone: "+15550112233",
      trade: "Plumbing",
      rating: 4.9,
      hourlyRate: 120,
      location: "Downtown Springfield",
      isAvailable: true,
    },
  });

  const plumber2 = await db.contractor.create({
    data: {
      name: "FastFlow Emergency Pipe Repair",
      phone: "+15550199887",
      trade: "Plumbing",
      rating: 4.7,
      hourlyRate: 145,
      location: "West End",
      isAvailable: true,
    },
  });

  const electrician1 = await db.contractor.create({
    data: {
      name: "VoltMaster Electrical Inc",
      phone: "+15550177665",
      trade: "Electrical",
      rating: 4.8,
      hourlyRate: 130,
      location: "Central Bay",
      isAvailable: true,
    },
  });

  const hvac1 = await db.contractor.create({
    data: {
      name: "Arctic Cool HVAC Services",
      phone: "+15550133445",
      trade: "HVAC",
      rating: 4.6,
      hourlyRate: 110,
      location: "North District",
      isAvailable: true,
    },
  });

  // Create Sample Tickets
  const ticket1 = await db.ticket.create({
    data: {
      title: "Burst Pipe Under Kitchen Sink",
      description: "Water is actively pooling on the wood laminate floor. Emergency attention needed.",
      category: "Plumbing",
      priority: "EMERGENCY",
      status: "CONFIRMED",
      propertyId: prop1.id,
      tenantId: tenant1.id,
      selectedContractorId: plumber1.id,
      agreedPrice: 150,
      scheduledAt: "2:00 PM Today",
      triageNotes: "Verified via triage call: Active leak from P-trap joint, water shutoff valve is partially closed.",
    },
  });

  const ticket2 = await db.ticket.create({
    data: {
      title: "Main Circuit Breaker Tripping Repeatedly",
      description: "Server room lights and HVAC shut off when coffee machine is powered on.",
      category: "Electrical",
      priority: "HIGH",
      status: "SOURCING",
      propertyId: prop2.id,
      tenantId: tenant2.id,
      triageNotes: "Agent verified 20A breaker overload on Subpanel B. Contacting certified electricians for quotes.",
    },
  });

  const ticket3 = await db.ticket.create({
    data: {
      title: "AC Unit Blowing Warm Air",
      description: "Air conditioner running continuously but indoor temperature is 82°F.",
      category: "HVAC",
      priority: "MEDIUM",
      status: "OPEN",
      propertyId: prop3.id,
      tenantId: tenant3.id,
    },
  });

  // Create Sample Call Logs for Ticket 1
  await db.callLog.create({
    data: {
      ticketId: ticket1.id,
      callType: "TRIAGE",
      targetPhone: tenant1.phone,
      targetName: tenant1.name,
      targetRole: "TENANT",
      status: "COMPLETED",
      planId: "plan_triage_001",
      runId: "run_triage_001",
      transcript: "AI: Hi Sarah, calling from FixItFlow regarding your kitchen sink leak ticket.\nSarah: Oh thank goodness! Water is dripping quite fast.\nAI: Have you located the shutoff valve under the sink?\nSarah: I turned it clockwise, it slowed down to a small drip.\nAI: Perfect. I am dispatching an emergency plumber right away.",
      extractedData: JSON.stringify({
        severity: "CRITICAL",
        leakSource: "P-trap junction",
        waterShutoffAttempted: true,
        accessNotes: "Doorman has spare master key",
      }),
      summary: "Triage confirmed active plumbing leak. Tenant successfully mitigated flow using shutoff valve. Dispatched sourcing calls.",
    },
  });

  await db.callLog.create({
    data: {
      ticketId: ticket1.id,
      callType: "SOURCING",
      targetPhone: plumber1.phone,
      targetName: plumber1.name,
      targetRole: "CONTRACTOR",
      status: "COMPLETED",
      planId: "plan_source_001",
      runId: "run_source_001",
      transcript: "AI: Hello, calling from FixItFlow dispatch. We have an emergency P-trap repair at 742 Evergreen Terrace. Are you available today?\nPlumber: Yes, I can swing by at 2:00 PM. Standard dispatch is $150.\nAI: Great, locking in 2:00 PM for $150.",
      extractedData: JSON.stringify({
        availableToday: true,
        quotedPrice: 150,
        earliestSlot: "2:00 PM Today",
      }),
      summary: "Apex Plumbing agreed to $150 quote for 2:00 PM today.",
    },
  });

  await db.callLog.create({
    data: {
      ticketId: ticket1.id,
      callType: "CONFIRMATION",
      targetPhone: tenant1.phone,
      targetName: tenant1.name,
      targetRole: "TENANT",
      status: "COMPLETED",
      planId: "plan_confirm_001",
      runId: "run_confirm_001",
      transcript: "AI: Hi Sarah! Apex Plumbing has been confirmed for 2:00 PM today. Estimated cost is $150 covered under property maintenance.\nSarah: Awesome, thank you so much!",
      extractedData: JSON.stringify({
        appointmentConfirmed: true,
        tenantNotified: true,
      }),
      summary: "Tenant confirmed for 2:00 PM appointment with Apex Plumbing.",
    },
  });

  console.log("✅ FixItFlow database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
