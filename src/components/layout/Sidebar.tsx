import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Server, Play, Settings } from "lucide-react";
import xandeumLogo from "../../../public/xandeum-logo.png";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Nodes", url: "/nodes", icon: Server },
  { title: "Simulator", url: "/simulator", icon: Play },
  { title: "Settings", url: "/settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <img src={xandeumLogo} alt="Xandeum" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-lg font-semibold text-gradient">Xandeum</h1>
            <p className="text-xs text-muted-foreground">Nexus Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">Network Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
