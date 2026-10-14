import "server-only";
import { authorize } from "@/server/security";
import { listUnits } from "@/server/data";
import { failure, json } from "@/server/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    authorize(request);
    return json({ units: await listUnits() });
  } catch (error) {
    return failure(error);
  }
}
