import { requireUser } from "@/lib/auth/session";
import { ExamSession } from "./ExamSession";

export const metadata = { title: "Test" };

export default async function ExamPage({ params }: { params: Promise<{ scope: string }> }) {
  await requireUser();
  const { scope } = await params;
  return <ExamSession scope={scope} />;
}
