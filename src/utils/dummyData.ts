import { Booking, Guest, Room } from "../types";

export const rooms: Room[] = [
  {
    id: "r1",
    number: "101",
    type: "Deluxe",
    capacity: 2,
    price: 250,
    status: "available",
    image: "/placeholder.svg",
    features: ["Ocean View", "King Bed", "Balcony", "Mini Bar"],
  },
  {
    id: "r2",
    number: "102",
    type: "Standard",
    capacity: 2,
    price: 180,
    status: "occupied",
    image: "/placeholder.svg",
    features: ["City View", "Queen Bed", "Work Desk"],
  },
  {
    id: "r3",
    number: "103",
    type: "Deluxe",
    capacity: 2,
    price: 220,
    status: "reserved",
    image: "/placeholder.svg",
    features: ["Garden View", "Twin Beds", "Sofa"],
  },
  {
    id: "r4",
    number: "201",
    type: "Executive",
    capacity: 3,
    price: 380,
    status: "available",
    image: "/placeholder.svg",
    features: ["Ocean View", "King Bed", "Living Area", "Jacuzzi"],
  },
  {
    id: "r5",
    number: "202",
    type: "Suite",
    capacity: 4,
    price: 420,
    status: "maintenance",
    image: "/placeholder.svg",
    features: ["Mountain View", "King Bed + 2 Singles", "Kitchenette"],
  },
  {
    id: "r6",
    number: "203",
    type: "Suite",
    capacity: 2,
    price: 750,
    status: "available",
    image: "/placeholder.svg",
    features: ["Panoramic View", "King Bed", "Private Pool", "Butler Service"],
  },
];

export const guests: Guest[] = [
  {
    id: "g1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    nationality: "USA",
    idNumber: "AB123456",
    visits: 3,
    vip: true,
    notes: "Prefers high floor rooms",
  },
  {
    id: "g2",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    phone: "+1 (555) 987-6543",
    nationality: "Canada",
    idNumber: "CD789012",
    visits: 1,
    vip: false,
  },
  {
    id: "g3",
    name: "Akira Tanaka",
    email: "akira.t@example.com",
    phone: "+81 (3) 1234-5678",
    nationality: "Japan",
    idNumber: "EF345678",
    visits: 5,
    vip: true,
    notes: "Allergic to nuts",
  },
  {
    id: "g4",
    name: "Sophie Martin",
    email: "sophie.m@example.com",
    phone: "+33 (1) 23-45-67-89",
    nationality: "France",
    idNumber: "GH901234",
    visits: 2,
    vip: false,
  },
  {
    id: "g5",
    name: "Carlos Rodriguez",
    email: "carlos.r@example.com",
    phone: "+34 (91) 234-5678",
    nationality: "Spain",
    idNumber: "IJ567890",
    visits: 1,
    vip: false,
  },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    roomId: "r2",
    roomNumber: "102",
    guestId: "g1",
    guestName: "John Smith",
    checkIn: "2023-11-15",
    checkOut: "2023-11-18",
    status: "checked-in",
    paymentStatus: "paid",
    amount: 540,
    createDate: "2023-10-20",
  },
  {
    id: "b2",
    roomId: "r4",
    roomNumber: "201",
    guestId: "g3",
    guestName: "Akira Tanaka",
    checkIn: "2023-11-20",
    checkOut: "2023-11-25",
    status: "confirmed",
    paymentStatus: "paid",
    amount: 1900,
    createDate: "2023-09-15",
  },
  {
    id: "b3",
    roomId: "r3",
    roomNumber: "103",
    guestId: "g2",
    guestName: "Emma Johnson",
    checkIn: "2023-11-10",
    checkOut: "2023-11-12",
    status: "checked-out",
    paymentStatus: "paid",
    amount: 440,
    createDate: "2023-10-05",
  },
  {
    id: "b4",
    roomId: "r1",
    roomNumber: "101",
    guestId: "g4",
    guestName: "Sophie Martin",
    checkIn: "2023-11-25",
    checkOut: "2023-11-27",
    status: "confirmed",
    paymentStatus: "pending",
    amount: 500,
    createDate: "2023-11-01",
  },
  {
    id: "b5",
    roomId: "r5",
    roomNumber: "202",
    guestId: "g5",
    guestName: "Carlos Rodriguez",
    checkIn: "2023-11-05",
    checkOut: "2023-11-08",
    status: "canceled",
    paymentStatus: "refunded",
    amount: 1260,
    createDate: "2023-10-10",
  },
];

// Dashboard stats calculation
export const getDashboardStats = () => {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;

  const upcomingArrivals = bookings.filter(
    (b) =>
      b.status === "confirmed" &&
      new Date(b.checkIn) > new Date() &&
      new Date(b.checkIn) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  const expectedDepartures = bookings.filter(
    (b) =>
      b.status === "checked-in" &&
      new Date(b.checkOut) > new Date() &&
      new Date(b.checkOut) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  ).length;

  const todayRevenue = 2450; // Mocked value

  return {
    roomStats: {
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
    },
    guestStats: {
      upcomingArrivals,
      expectedDepartures,
      inHouse: occupiedRooms,
    },
    revenueStats: {
      todayRevenue,
      mtdRevenue: 42680,
      averageDailyRate: 285,
    },
  };
};
