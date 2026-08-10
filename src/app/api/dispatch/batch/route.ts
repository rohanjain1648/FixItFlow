import { NextResponse } from "next/server";
import { batchDispatchEngine } from "@/lib/batch-dispatch";

export async function POST() {
  try {
    const result = await batchDispatchEngine.dispatchAllOpenTickets();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
