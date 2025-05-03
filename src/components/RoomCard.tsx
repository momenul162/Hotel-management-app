import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Bed, CheckCircle, Coffee, MoreHorizontal, Trash, Users, Wifi } from "lucide-react";
import { Room, RoomStatus } from "../types";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EditRoomDialog } from "./rooms/EditRoom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { deleteRoom } from "../redux/service/roomService";
import { RoomCardSkeleton } from "./ui/skeleton/room-card-skeleton";

interface RoomCardProps {
  room?: Room;
}

const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 border-green-200";
    case "occupied":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "reserved":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "maintenance":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: RoomStatus) => {
  switch (status) {
    case "available":
      return "Available";
    case "occupied":
      return "Occupied";
    case "reserved":
      return "Reserved";
    case "maintenance":
      return "Maintenance";
    default:
      return status;
  }
};

export function RoomCard({ room }: RoomCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  if (!room) {
    return <RoomCardSkeleton />;
  }

  const { number, type, capacity, price, status, image, features } = room;

  const handleRemove = (id: string) => {
    dispatch(deleteRoom(id));
  };

  return (
    <div>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
          "animate-in fade-in-delay"
        )}
      >
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={`Room ${number}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <Badge
            variant="outline"
            className={cn("absolute top-2 right-2 text-xs font-medium", getStatusColor(status))}
          >
            {getStatusText(status)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{type}</h3>
              <p className="text-sm text-muted-foreground">Room {number}</p>
            </div>
            <p className="font-semibold text-md">
              ${price}
              <span className="text-xs text-muted-foreground">/night</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground mt-3">
            <div className="flex items-center gap-1 text-xs">
              <Users className="h-3.5 w-3.5" />
              <span>{capacity}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Bed className="h-3.5 w-3.5" />
              <span>
                {type.includes("King")
                  ? "King Bed"
                  : type.includes("Queen")
                  ? "Queen Bed"
                  : "Twin Beds"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 p-3 flex justify-between">
          <div className="flex gap-2 text-muted-foreground">
            {features.includes("Wi-Fi") && <Wifi className="h-4 w-4" />}
            {features.includes("Mini Bar") && <Coffee className="h-4 w-4" />}
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="flex items-center gap-1 bg-background">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs">Free cancellation</span>
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <EditRoomDialog room={room} />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleRemove(room._id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Remove room
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
