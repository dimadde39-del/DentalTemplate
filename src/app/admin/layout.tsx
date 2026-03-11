import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header 
        className="text-white shadow-md relative z-10"
        style={{ backgroundColor: siteConfig.primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              {siteConfig.clinicName} Admin
            </h1>
          </div>
          <nav>
            <span className="text-sm font-medium opacity-90 bg-white/10 px-3 py-1.5 rounded-full">
              Dashboard
            </span>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
