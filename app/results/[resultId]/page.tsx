import { ResultsPage } from "../../../src/components/ResultsPage";
export default async function Page({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  return <ResultsPage resultId={resultId} />;
}
