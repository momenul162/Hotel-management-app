export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";
export type RoomType = "Standard" | "Deluxe" | "Suite" | "Executive";
export type BookingStatus = "confirmed" | "checked-in" | "checked-out" | "canceled";

export interface Room {
  _id: string;
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  status: RoomStatus;
  image?: string;
  features: string[];
}

export interface Guest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  visits: number;
  avatar?: string;
  passportOrNID: string;
  vip: boolean;
  activities?: Array<{ _id: string; checkedIn: Date; checkedOut: Date }>;
}

export interface Booking {
  _id: string;
  roomId: { _id: string; number: string; type: RoomType; price: number };
  guestId: { _id: string; name: string; email: string; phone: string };
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  paymentStatus: "pending" | "paid" | "refunded";
  totalAmount: number;
  createDate: string;
}
export interface BookingCreate {
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
}

export interface Inventory {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  supplier: string;
  lastRestocked: Date;
}

export interface InventoryCreate {
  name: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  supplier: string;
  lastRestocked: string;
}

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "inactive";
  avatar?: string;
}

export interface StaffCreate {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status?: "active" | "on-leave" | "inactive";
  avatar?: string;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  description: string;
  change: number;
  icon: React.ReactNode;
}
