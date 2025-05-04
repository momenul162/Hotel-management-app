import React from "react";
import {
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export type ReportType = "revenue" | "occupancy" | "guests" | "staff";
export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

// Mock data for reports
const revenueData = [
  { name: "Jan", value: 89000 },
  { name: "Feb", value: 95000 },
  { name: "Mar", value: 108000 },
  { name: "Apr", value: 120000 },
  { name: "May", value: 135000 },
  { name: "Jun", value: 152385 },
];

const occupancyData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 68 },
  { name: "Mar", value: 72 },
  { name: "Apr", value: 75 },
  { name: "May", value: 80 },
  { name: "Jun", value: 78 },
];

const roomTypeData = [
  { name: "Deluxe", value: 42 },
  { name: "Standard", value: 35 },
  { name: "Suite", value: 23 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const RevenueChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]} />
        <Legend />
        <Area
          type="monotone"
          dataKey="value"
          name="Revenue"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const OccupancyChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={occupancyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: any) => [`${value}%`, "Occupancy Rate"]} />
        <Legend />
        <Line type="monotone" dataKey="value" name="Occupancy" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// interface PieChartLabelProps {
//   cx: number;
//   cy: number;
//   midAngle: number;
//   innerRadius: number;
//   outerRadius: number;
//   percent: number;
//   index: number;
//   name: string;
// }

export const RoomDistributionChart: React.FC = () => {
  const renderCustomizedLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={roomTypeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={renderCustomizedLabel}
        >
          {roomTypeData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [`${value}%`, "Percentage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const generateReport = (type: ReportType, _range: TimeRange) => {
  // In a real app, this would make API calls based on type and range

  switch (type) {
    case "revenue":
      return revenueData;
    case "occupancy":
      return occupancyData;
    default:
      return [];
  }
};

export const downloadReport = (type: ReportType, format: "pdf" | "csv" | "excel") => {
  // Mock function - in a real app, this would generate and download a file
  return `${type}_report.${format}`;
};
