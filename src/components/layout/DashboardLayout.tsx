import {Sidebar} from "./Sidebar";
import Topbar from "./Topbar"; // Import the new Topbar

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar (Fixed Top) */}
        <Topbar />

        {/* Scrollable Page Content */}
        {/* Added 'pt-16' to account for the fixed Topbar height */}
        <div className="flex-1 overflow-y-auto p-6 pt-20"> 
           {children}
        </div>
        
      </main>
      
    </div>
  );
}