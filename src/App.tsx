import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { SettingsProvider } from "./contexts/SettingsContext";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/reservations/NewReservation";
import Guests from "./pages/Guests";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import store from "./redux/store";
import ChangeStatus from "./components/reservation/change-status";
import StaffPage from "./pages/Staff";
import InventoryPage from "./pages/Inventory";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reservations/new" element={<NewReservation />} />
              <Route path="/reservations/status-change" element={<ChangeStatus />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
