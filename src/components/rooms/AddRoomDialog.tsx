import { useState, useEffect } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Room } from "../../types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createRoom, RoomCreate } from "../../redux/service/roomService";

const roomFormSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.enum(["Standard", "Deluxe", "Suite", "Executive"]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  status: z.enum(["available", "occupied", "maintenance", "reserved"]),
  image: z.string().optional(),
  features: z.array(z.string()),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

const features = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "minibar", label: "Mini Bar" },
  { id: "ac", label: "Air Conditioning" },
  { id: "tv", label: "Smart TV" },
  { id: "safe", label: "Safe" },
  { id: "balcony", label: "Balcony" },
  { id: "bathtub", label: "Bathtub" },
  { id: "workspace", label: "Workspace" },
];

interface RoomCardProps {
  room?: Room;
  setOpen: (open: boolean) => void;
}

export function AddRoomDialog({ room, setOpen }: RoomCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      number: "",
      type: "Standard",
      capacity: 2,
      price: 100,
      status: "available",
      features: ["Wi-Fi", "Air Conditioning"],
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        number: room.number,
        type: room.type,
        capacity: room.capacity,
        price: room.price,
        status: room.status,
        image: room.image || "",
        features: room.features || [],
      });
    }
  }, [room, form]);

  const onSubmit: SubmitHandler<RoomCreate> = async (data) => {
    setIsSubmitting(true);

    try {
      // Ensure features is always an array
      const roomData = { ...data, features: data.features || [] };

      const result = await dispatch(createRoom(roomData));
      if (result.type.includes("fulfilled")) {
        toast.success("Room created successfully!");
      }

      setOpen(false);
    } catch (error) {
      toast.error("Failed to save room");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input placeholder="101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Standard">Standard Queen</SelectItem>
                      <SelectItem value="Deluxe">Deluxe King</SelectItem>
                      <SelectItem value="Suite">Junior Suite</SelectItem>
                      <SelectItem value="Executive">Executive Suite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($/night)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/room.jpg" {...field} />
                  </FormControl>
                  <FormDescription>Optional. Leave empty for default image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Features</FormLabel>
                  <FormDescription>Select the features available in this room.</FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {features.map((feature) => (
                    <FormField
                      key={feature.id}
                      control={form.control}
                      name="features"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={feature.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature.label)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, feature.label]);
                                  } else {
                                    field.onChange(
                                      current.filter((value) => value !== feature.label)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{feature.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Room"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
