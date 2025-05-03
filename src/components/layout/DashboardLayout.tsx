import { useEffect } from "react";
import { Navbar } from "../layout/Navbar";
import { Sidebar, SidebarProvider } from "../layout/Sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
import { useLocalStorage } from "../../hooks/use-local-storage";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [theme] = useLocalStorage<"light" | "dark">("theme", "light");

  // Apply theme class on component mount and when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            !isMobile ? "ml-[70px]" : ""
          }`}
        >
          <Navbar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
