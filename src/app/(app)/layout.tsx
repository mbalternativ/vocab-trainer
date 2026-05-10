import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageContainer } from "@/components/layout/page-container";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PageContainer>
      <AppHeader />
      <div className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
        <AppSidebar />
        <main>{children}</main>
      </div>
    </PageContainer>
  );
}
