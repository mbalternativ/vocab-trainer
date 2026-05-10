import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <PageContainer>
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm uppercase tracking-wide text-slate-500">English vocabulary trainer</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-900">
          A scalable web app foundation for vocabulary learning, pronunciation, progress tracking, and photo imports.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          This starter uses Next.js, TypeScript, Supabase, modular domain services, and a clean page structure for later growth.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/dashboard"><Button>Open dashboard</Button></Link>
          <Link href="/vocabulary"><Button variant="secondary">Browse vocabulary</Button></Link>
        </div>
      </div>
    </PageContainer>
  );
}
