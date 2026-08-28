import AdminSidebar from "@/components/ui/admin-sidebar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function layout({ children }: Props) {
  return (
    <main className="bg-slate-100 min-h-screen">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">{children}</div>
      </div>
    </main>
  );
}

export default layout;
