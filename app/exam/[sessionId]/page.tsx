import { ExamPage } from "../../../src/components/ExamPage";
export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <ExamPage sessionId={sessionId} />;
}
