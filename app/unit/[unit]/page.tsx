import { UnitPage } from "../../../src/components/UnitPage";
export default async function Page({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit } = await params;
  return <UnitPage key={unit} unit={Number(unit)} />;
}
