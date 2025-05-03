import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useMemo, useState } from "react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

interface RoomStateProps {
  className?: string;
}

export function RoomState({ className }: RoomStateProps) {
  const { rooms } = useSelector((state: RootState) => state.rooms);
  const { bookings } = useSelector((state: RootState) => state.booking);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  // Calculate room states based on the selected time range
  const roomStateData = useMemo(() => {
    const today = new Date();
    let startDate;
    let endDate;

    switch (timeRange) {
      case "week":
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case "month":
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case "today":
      default:
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
    }

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
    const reservedRooms = rooms.filter((room) => room.status === "reserved").length;
    const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length;
    const availableRooms = rooms.filter((room) => room.status === "available").length;

    return { totalRooms, occupiedRooms, reservedRooms, maintenanceRooms, availableRooms };
  }, [rooms, bookings, timeRange]);

  // Chart data
  const chartData = useMemo(() => {
    return {
      labels: ["Available Rooms", "Reserved Rooms", "Occupied Rooms", "Maintenance Rooms"],
      datasets: [
        {
          label: "Rooms",
          data: [
            roomStateData.availableRooms,
            roomStateData.reservedRooms,
            roomStateData.occupiedRooms,
            roomStateData.maintenanceRooms,
          ],
          backgroundColor: ["#D1FAE5", "#FEF3C7", "#DBEAFE", "#FEE2E2"], // Green, Amber, Blue, Red
          borderColor: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"], // Darker shades for borders
          borderWidth: 1,
        },
      ],
    };
  }, [roomStateData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        align: "center" as const,
      },
      title: {
        display: true,
        text: `Room State (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`,
      },
    },
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Room Status</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "today" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setTimeRange("today")}
            >
              Today
            </Button>
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setTimeRange("week")}
            >
              Week
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setTimeRange("month")}
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="h-[275px] w-[275px]">
          {roomStateData.totalRooms > 0 ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <p className="text-muted-foreground italic text-center">No room data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
