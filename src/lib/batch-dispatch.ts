import { db } from "@/lib/db";
import { dispatchEngine } from "@/lib/dispatch-engine";

export interface BatchItemResult {
  ticketId: string;
  title: string;
  status: "SUCCESS" | "FAILED";
  error?: string;
}

export interface BatchResult {
  totalProcessed: number;
  succeeded: number;
  failed: number;
  items: BatchItemResult[];
}

export class BatchDispatchEngine {
  /**
   * Dispatches all OPEN tickets in batch mode with concurrency rate-limiting
   */
  async dispatchAllOpenTickets(): Promise<BatchResult> {
    const openTickets = await db.ticket.findMany({
      where: { status: "OPEN" },
    });

    if (openTickets.length === 0) {
      return {
        totalProcessed: 0,
        succeeded: 0,
        failed: 0,
        items: [],
      };
    }

    const items: BatchItemResult[] = [];

    // Process tickets in parallel batches of 3
    const batchSize = 3;
    for (let i = 0; i < openTickets.length; i += batchSize) {
      const chunk = openTickets.slice(i, i + batchSize);

      const chunkResults = await Promise.allSettled(
        chunk.map(async (t) => {
          // Full automated sequence: triage -> source -> confirm
          await dispatchEngine.triageTicket(t.id);
          await dispatchEngine.sourceContractors(t.id);
          await dispatchEngine.confirmAppointment(t.id);
          return t;
        })
      );

      chunkResults.forEach((res, index) => {
        const ticket = chunk[index];
        if (res.status === "fulfilled") {
          items.push({
            ticketId: ticket.id,
            title: ticket.title,
            status: "SUCCESS",
          });
        } else {
          items.push({
            ticketId: ticket.id,
            title: ticket.title,
            status: "FAILED",
            error: res.reason?.message || "Batch dispatch error",
          });
        }
      });
    }

    const succeeded = items.filter((i) => i.status === "SUCCESS").length;
    const failed = items.filter((i) => i.status === "FAILED").length;

    return {
      totalProcessed: openTickets.length,
      succeeded,
      failed,
      items,
    };
  }
}

export const batchDispatchEngine = new BatchDispatchEngine();
