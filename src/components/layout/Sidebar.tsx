import * as React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  Home,
  Hotel,
  Layers,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCurrentUser } from "../../redux/service/authService";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(true);
  const isMobile = useIsMobile();

  // Automatically collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarTrigger({ children }: { children?: React.ReactNode }) {
  const { setExpanded } = useSidebar();

  return <div onClick={() => setExpanded((prev) => !prev)}>{children}</div>;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { expanded, setExpanded } = useSidebar();
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-[70px]",
          isMobile && !expanded && "translate-x-[-100%]",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={cn("flex items-center gap-2 font-semibold", !expanded && "opacity-0")}>
            <Hotel className="h-6 w-6 text-primary" />
            <span className="text-xl">Luxury Suites</span>
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setExpanded(!expanded)}
            >
              <ChevronLeft
                className={cn("h-4 w-4 transition-transform", !expanded && "rotate-180")}
              />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 py-3">
          <nav className="grid gap-1 px-2">
            <NavItem to="/" icon={<Home className="h-4 w-4" />} expanded={expanded}>
              Dashboard
            </NavItem>
            <NavItem to="/rooms" icon={<Hotel className="h-4 w-4" />} expanded={expanded}>
              Rooms
            </NavItem>
            <NavItem to="/reservations" icon={<Calendar className="h-4 w-4" />} expanded={expanded}>
              Reservations
            </NavItem>
            <NavItem to="/guests" icon={<Users className="h-4 w-4" />} expanded={expanded}>
              Guests
            </NavItem>

            <div className={cn("my-3 border-t border-border/50", !expanded && "mx-2")}>
              <div
                className={cn(
                  "mt-3 mb-1 px-2 text-xs font-medium text-muted-foreground",
                  !expanded && "sr-only"
                )}
              >
                Management
              </div>
            </div>

            <NavItem to="/staff" icon={<User className="h-4 w-4" />} expanded={expanded}>
              Staff
            </NavItem>
            <NavItem to="/inventory" icon={<Layers className="h-4 w-4" />} expanded={expanded}>
              Inventory
            </NavItem>
            <NavItem to="/reports" icon={<BarChart2 className="h-4 w-4" />} expanded={expanded}>
              Reports
            </NavItem>
            <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} expanded={expanded}>
              Settings
            </NavItem>
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div className={cn("flex items-center gap-2", !expanded && "justify-center")}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-xs font-medium">JD</span>
            </div>
            <div className={cn(!expanded && "hidden")}>
              <div className="text-sm font-medium">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser?.role === "admin" ? "Admin" : "Staff"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  expanded: boolean;
  children: React.ReactNode;
}

function NavItem({ to, icon, expanded, children }: NavItemProps) {
  // const location = useLocation();
  // const isActive = location.pathname === to;

  return (
    <NavLink to={to} className="outline-none">
      {({ isActive: active }) => (
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3",
            !expanded && "justify-center px-0",
            active && "bg-accent"
          )}
        >
          {icon}
          {expanded && <span>{children}</span>}
        </Button>
      )}
    </NavLink>
  );
}
