import { Suspense } from "react";
import WriterVerifyEmailForm from "./_components/WriterVerifyEmailForm";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default function WriterVerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WriterVerifyEmailForm />
    </Suspense>
  );
}
