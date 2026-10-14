import { notFound } from "next/navigation";
import { TEST_IDS, type TestId } from "../../../../src/types/exam";
import { ListenPage } from "../../../../src/components/ListenPage";

export default async function Page({ params }: {
  params: Promise<{ unit: string; test: string }>;
}) {
  const { unit, test } = await params;
  if (!/^[1-8]$/.test(unit) || !TEST_IDS.includes(test as TestId)) notFound();
  return <ListenPage unit={Number(unit)} testId={test as TestId} />;
}
