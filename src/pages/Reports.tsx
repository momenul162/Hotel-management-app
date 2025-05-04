import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart3, Calendar, FileDown, FileText, LineChart, PieChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RevenueChart, OccupancyChart } from "../utils/reportService";
import { toast } from "sonner";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllBookings } from "../redux/service/bookingService";
import { fetchAllRooms } from "../redux/service/roomService";
import { Room } from "../types";

export default function Reports() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const dispatch = useDispatch<AppDispatch>();
  const { bookings } = useSelector((state: RootState) => state.booking);
  const { rooms } = useSelector((state: RootState) => state.rooms);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchAllRooms());
  }, [dispatch]);

  const metrics = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((room: Room) => room.status === "reserved").length;
    const revenue = bookings.reduce((total, booking) => total + booking.totalAmount, 0);

    const roomDistribution = {
      deluxe: rooms.filter((room: Room) => room.type === "Deluxe").length,
      standard: rooms.filter((room: Room) => room.type === "Standard").length,
      suite: rooms.filter((room: Room) => room.type === "Suite").length,
      executive: rooms.filter((room: Room) => room.type === "Executive").length,
    };
    const averageOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      occupiedRooms,
      revenue,
      roomDistribution,
      averageOccupancy,
    };
  }, [rooms, bookings]);

  const handleExport = () => {
    toast.success("Report exported successfully!");
  };

  const handleShare = () => {
    toast.success("Report shared successfully!");
  };

  const handleViewReport = (reportName: string) => {
    toast.info(`Viewing ${reportName} report`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generate and view reports about hotel performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              Export
            </Button>
            <Button onClick={handleShare}>Share Reports</Button>
          </div>
        </div>

        <div className="flex items-center justify-end mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Occupancy</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{metrics.averageOccupancy}%</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <span className="text-green-500 mr-1">↑ 12%</span> vs last month
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">${metrics.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <span className="text-green-500 mr-1">↑ 8%</span> vs last month
                      </p>
                    </div>
                    <LineChart className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Room Distribution</CardTitle>
                  <CardDescription>By room type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        Deluxe: {metrics.roomDistribution.deluxe}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Standard: {metrics.roomDistribution.standard}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Suite: {metrics.roomDistribution.suite}%
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <RevenueChart />
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Occupancy Rate</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <OccupancyChart />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Access your recently generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Monthly Performance", "Guest Satisfaction", "Revenue Analysis"].map(
                    (report, i) => (
                      <Card key={i} className="flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <FileText className="h-8 w-8 text-primary/70" />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardTitle className="text-base">{report}</CardTitle>
                          <CardDescription className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date().toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 mt-auto">
                          <Button
                            variant="outline"
                            className="w-full text-xs"
                            onClick={() => handleViewReport(report)}
                          >
                            View Report
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Analytics</CardTitle>
                <CardDescription>Detailed view of hotel occupancy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <OccupancyChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed view of hotel revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <RevenueChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>Create custom reports based on your requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Select defaultValue="revenue">
                        <SelectTrigger>
                          <SelectValue placeholder="Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="occupancy">Occupancy</SelectItem>
                          <SelectItem value="guest">Guest Statistics</SelectItem>
                          <SelectItem value="staff">Staff Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue placeholder="Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Generate Report</Button>
                  </div>

                  <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Generate a report to view data here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
