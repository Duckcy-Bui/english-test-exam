import "server-only";
import { listUnits } from "@/server/data";
import { checkQuotaStorage } from "@/server/security";
import { json } from "@/server/http";

export const runtime = "nodejs";
export async function GET() {
  try {
    if (
      !process.env.ACCESS_CODE?.trim() ||
      (process.env.AI_MOCK !== "1" && !process.env.AI_API_KEY?.trim())
    )
      throw new Error("configuration");
    const units = await listUnits();
    if (units.length !== 8 || units.some((unit) => !unit.available))
      throw new Error("data");
    checkQuotaStorage();
    return json({ status: "ok" });
  } catch {
    return json({ status: "unhealthy" }, 503);
  }
}
