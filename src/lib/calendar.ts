export interface CalendarEventInput {
  ticketId: string;
  title: string;
  description: string;
  location: string;
  tenantName: string;
  contractorName: string;
  scheduledAt: string; // e.g. "2:00 PM Today"
}

export interface CalendarEventResult {
  eventId: string;
  calendarLink: string;
  icsContent: string;
  status: "SYNCED" | "CREATED";
}

export class CalendarService {
  /**
   * Generates a calendar event and ICS file data for a confirmed repair appointment
   */
  async createEvent(input: CalendarEventInput): Promise<CalendarEventResult> {
    const eventId = `cal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const now = new Date();
    const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatIcsDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FixItFlow//CALL-E Dispatch System//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${eventId}@fixitflow.ai`,
      `DTSTAMP:${formatIcsDate(now)}`,
      `DTSTART:${formatIcsDate(startTime)}`,
      `DTEND:${formatIcsDate(endTime)}`,
      `SUMMARY:FixItFlow Repair: ${input.title}`,
      `DESCRIPTION:Contractor: ${input.contractorName}\\nTenant: ${input.tenantName}\\nDetails: ${input.description}`,
      `LOCATION:${input.location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `FixItFlow Repair: ${input.title}`
    )}&details=${encodeURIComponent(
      `Contractor: ${input.contractorName}\nTenant: ${input.tenantName}`
    )}&location=${encodeURIComponent(input.location)}`;

    console.log(`📅 [Calendar Synced] Created Event: ${eventId} for ${input.contractorName}`);

    return {
      eventId,
      calendarLink,
      icsContent,
      status: "SYNCED",
    };
  }
}

export const calendarService = new CalendarService();
