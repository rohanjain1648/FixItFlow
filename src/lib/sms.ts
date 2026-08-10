export interface SmsNotificationInput {
  contractorName: string;
  contractorPhone: string;
  ticketTitle: string;
  propertyAddress: string;
  category: string;
  priority: string;
  callbackUrl?: string;
}

export interface SmsNotificationResult {
  messageId: string;
  status: "DELIVERED" | "SENT" | "FAILED";
  recipientPhone: string;
  messageBody: string;
  sentAt: string;
}

export class SmsFallbackService {
  /**
   * Sends an SMS notification when a contractor call fails or is unanswered
   */
  async sendJobNotification(input: SmsNotificationInput): Promise<SmsNotificationResult> {
    const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const messageBody = `[FixItFlow Urgent Job Alert] Hi ${input.contractorName}, we tried calling you regarding a ${input.priority} ${input.category} job at ${input.propertyAddress} ("${input.ticketTitle}"). Reply YES to accept or call back to confirm availability.`;

    // Simulated SMS dispatch with structured response
    console.log(`📱 [SMS Fallback Sent] To ${input.contractorPhone}: "${messageBody}"`);

    return {
      messageId,
      status: "DELIVERED",
      recipientPhone: input.contractorPhone,
      messageBody,
      sentAt: new Date().toISOString(),
    };
  }
}

export const smsService = new SmsFallbackService();
