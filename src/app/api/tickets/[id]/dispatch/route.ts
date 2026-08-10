import { NextResponse } from "next/server";
import { dispatchEngine } from "@/lib/dispatch-engine";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { action = "auto" } = body; // "triage" | "source" | "confirm" | "auto"

    let result;

    if (action === "triage") {
      result = await dispatchEngine.triageTicket(id);
    } else if (action === "source") {
      result = await dispatchEngine.sourceContractors(id);
    } else if (action === "confirm") {
      result = await dispatchEngine.confirmAppointment(id);
    } else {
      // Full Autonomous Multi-Step Dispatch Sequence!
      const triageRes = await dispatchEngine.triageTicket(id);
      const sourcingRes = await dispatchEngine.sourceContractors(id);
      const confirmRes = await dispatchEngine.confirmAppointment(id);

      result = {
        message: "Autonomous AI Dispatch Completed",
        ticket: confirmRes,
        sourcingMatch: sourcingRes.matchDetails,
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
