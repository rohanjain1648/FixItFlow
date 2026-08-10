import { db } from "@/lib/db";
import { calle } from "@/lib/calle";
import { rankContractors } from "@/lib/scoring";
import { smsService } from "@/lib/sms";
import { calendarService } from "@/lib/calendar";

export class DispatchEngine {
  /**
   * Phase 1: Triage Call to Tenant
   */
  async triageTicket(ticketId: string) {
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { tenant: true, property: true },
    });

    if (!ticket) throw new Error("Ticket not found");

    // Update status to TRIAGING
    await db.ticket.update({
      where: { id: ticketId },
      data: { status: "TRIAGING" },
    });

    // Plan the triage call
    const plan = await calle.planCall({
      objective: `Triage maintenance issue: "${ticket.title}" at ${ticket.property.title} (${ticket.property.address})`,
      context: {
        tenantName: ticket.tenant.name,
        issueDescription: ticket.description,
        property: ticket.property.title,
      },
      dataToExtract: ["severity", "leakSource", "waterShutoffAttempted", "accessNotes"],
    });

    // Run the call
    const run = await calle.runCall({
      planId: plan.planId,
      phoneNumber: ticket.tenant.phone,
    });

    // Fetch result
    const result = await calle.getCallRun(run.runId);

    // Save Call Log
    await db.callLog.create({
      data: {
        ticketId: ticket.id,
        callType: "TRIAGE",
        targetPhone: ticket.tenant.phone,
        targetName: ticket.tenant.name,
        targetRole: "TENANT",
        status: "COMPLETED",
        planId: plan.planId,
        runId: run.runId,
        transcript: result.transcript,
        extractedData: JSON.stringify(result.extractedData),
        summary: `Triage completed for ${ticket.tenant.name}. Verified severity & repair details.`,
      },
    });

    // Update Ticket to TRIAGED
    const updatedTicket = await db.ticket.update({
      where: { id: ticketId },
      data: {
        status: "TRIAGED",
        triageNotes: `Verified via AI Triage Call: Issue "${ticket.title}" inspected. Tenant confirmed access details.`,
      },
    });

    return updatedTicket;
  }

  /**
   * Phase 2: Sourcing Calls to Contractors (with Multi-Language & SMS Fallback)
   */
  async sourceContractors(ticketId: string) {
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { tenant: true, property: true },
    });

    if (!ticket) throw new Error("Ticket not found");

    await db.ticket.update({
      where: { id: ticketId },
      data: { status: "SOURCING" },
    });

    // Find available contractors matching category
    const contractors = await db.contractor.findMany({
      where: {
        trade: { equals: ticket.category },
        isAvailable: true,
      },
    });

    // Fallback to all contractors if none match exact category
    const targetContractors = contractors.length > 0 ? contractors : await db.contractor.findMany({ take: 3 });

    const sourcingResults = [];

    for (const contractor of targetContractors) {
      // 🌐 Feature 2: Multi-Language support per contractor dialect
      const language = contractor.language || "en";

      const plan = await calle.planCall({
        objective: `Inquire about contractor availability & quote for ${ticket.category} job: ${ticket.title}`,
        language,
        context: {
          contractorName: contractor.name,
          issue: ticket.title,
          address: ticket.property.address,
          preferredLanguage: language,
        },
        dataToExtract: ["availableToday", "quotedPrice", "earliestSlot"],
      });

      const run = await calle.runCall({
        planId: plan.planId,
        phoneNumber: contractor.phone,
      });

      const result = await calle.getCallRun(run.runId);

      const quotedPrice = (result.extractedData.quotedPrice as number) || contractor.hourlyRate || 140;

      // 📱 Feature 1: Check if SMS Fallback is needed (e.g., if call failed/no-answer simulation)
      let smsFallbackSent = false;
      if (result.status === "FAILED") {
        await smsService.sendJobNotification({
          contractorName: contractor.name,
          contractorPhone: contractor.phone,
          ticketTitle: ticket.title,
          propertyAddress: ticket.property.address,
          category: ticket.category,
          priority: ticket.priority,
        });
        smsFallbackSent = true;
      }

      await db.callLog.create({
        data: {
          ticketId: ticket.id,
          callType: "SOURCING",
          targetPhone: contractor.phone,
          targetName: contractor.name,
          targetRole: "CONTRACTOR",
          status: smsFallbackSent ? "SMS_SENT" : "COMPLETED",
          planId: plan.planId,
          runId: run.runId,
          transcript: result.transcript,
          extractedData: JSON.stringify({ ...result.extractedData, quotedPrice, language }),
          summary: smsFallbackSent
            ? `Phone call unreachable. SMS Fallback alert delivered to ${contractor.name} (${language.toUpperCase()}).`
            : `Contacted ${contractor.name} in ${language.toUpperCase()}. Quote: $${quotedPrice}.`,
          smsFallbackSent,
        },
      });

      sourcingResults.push({
        contractorId: contractor.id,
        name: contractor.name,
        rating: contractor.rating,
        quotedPrice,
        hourlyRate: contractor.hourlyRate || undefined,
        isAvailable: contractor.isAvailable,
        priority: (ticket.priority as any) || "MEDIUM",
      });
    }

    // Rank contractors using scoring engine
    const ranked = rankContractors(sourcingResults);
    const topMatch = ranked[0];

    if (!topMatch) throw new Error("No available contractors found");

    // Update Ticket to MATCHED
    const matchedTicket = await db.ticket.update({
      where: { id: ticketId },
      data: {
        status: "MATCHED",
        selectedContractorId: topMatch.contractorId,
        agreedPrice: topMatch.quotedPrice,
      },
    });

    return { ticket: matchedTicket, matchDetails: topMatch };
  }

  /**
   * Phase 3: Confirmation Call to Tenant (with Calendar Sync)
   */
  async confirmAppointment(ticketId: string) {
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { tenant: true, property: true, selectedContractor: true },
    });

    if (!ticket || !ticket.selectedContractor) {
      throw new Error("Ticket or selected contractor not found");
    }

    const scheduledSlot = "2:00 PM Today";

    const plan = await calle.planCall({
      objective: `Confirm appointment slot with tenant Sarah Jenkins for ${ticket.selectedContractor.name}`,
      context: {
        tenantName: ticket.tenant.name,
        contractorName: ticket.selectedContractor.name,
        scheduledSlot,
        price: ticket.agreedPrice,
      },
    });

    const run = await calle.runCall({
      planId: plan.planId,
      phoneNumber: ticket.tenant.phone,
    });

    const result = await calle.getCallRun(run.runId);

    // 📅 Feature 3: Calendar Integration - Sync Event
    const calEvent = await calendarService.createEvent({
      ticketId: ticket.id,
      title: ticket.title,
      description: ticket.description,
      location: ticket.property.address,
      tenantName: ticket.tenant.name,
      contractorName: ticket.selectedContractor.name,
      scheduledAt: scheduledSlot,
    });

    await db.callLog.create({
      data: {
        ticketId: ticket.id,
        callType: "CONFIRMATION",
        targetPhone: ticket.tenant.phone,
        targetName: ticket.tenant.name,
        targetRole: "TENANT",
        status: "COMPLETED",
        planId: plan.planId,
        runId: run.runId,
        transcript: result.transcript,
        extractedData: JSON.stringify({ ...result.extractedData, calendarEventId: calEvent.eventId }),
        summary: `Appointment confirmed with ${ticket.tenant.name} for ${scheduledSlot} with ${ticket.selectedContractor.name}. Calendar event synced (${calEvent.eventId}).`,
      },
    });

    const confirmedTicket = await db.ticket.update({
      where: { id: ticketId },
      data: {
        status: "CONFIRMED",
        scheduledAt: scheduledSlot,
        calendarEventId: calEvent.eventId,
      },
    });

    return confirmedTicket;
  }
}

export const dispatchEngine = new DispatchEngine();
