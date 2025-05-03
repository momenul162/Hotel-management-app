import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createGuest, updateGuest } from "../../redux/service/guestService";

// Define Zod schema for validation
const guestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(20),
  nationality: z.string().min(2).max(50),
  visits: z.number().nonnegative().optional(),
  vip: z.boolean().optional(),
  passportOrNID: z.string().optional(),
  avatar: z.string().optional(),
});

// Type for form data
type GuestFormData = z.infer<typeof guestSchema>;

// Type for form data
interface Guest {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  visits?: number;
  passportOrNID?: string;
  vip?: boolean;
  avatar?: string;
}

interface AddEditGuestDialogProps {
  guest?: Guest;
  setViewDetailsOpen?: (id: boolean) => void;
}

export function AddEditGuestDialog({ guest, setViewDetailsOpen }: AddEditGuestDialogProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationality: "",
      passportOrNID: "",
      vip: false,
      avatar: "",
      visits: 0,
    },
  });

  // Watch isVip value
  const vip = watch("vip");

  // Pre populate form when editing a guest
  useEffect(() => {
    if (guest) {
      reset(guest);
    }
  }, [guest, reset]);

  const onSubmit = (formData: GuestFormData) => {
    const formattedData = {
      ...formData,
      visits: formData.visits ?? null,
      email: formData.email ?? null,
    };

    if (guest) {
      dispatch(updateGuest({ guestId: guest._id, guestData: formattedData }));
      setViewDetailsOpen?.(false);
      reset();
      toast.success("Guest updated successfully!");
    } else {
      dispatch(createGuest(formattedData));
      reset();
      toast.success("Guest added successfully!");
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {guest ? "Edit Guest" : "Add New Guest"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{guest ? "Edit Guest" : "Add New Guest"}</DialogTitle>
            <DialogDescription>
              {guest
                ? "Update the guest's information."
                : "Enter the guest's information below to add them to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" placeholder="United States" {...register("nationality")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passportOrNID">ID/Passport Number</Label>
                <Input id="passportOrNID" placeholder="AB123456" {...register("passportOrNID")} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="vip"
                  checked={vip}
                  onCheckedChange={(checked) => setValue("vip", checked)}
                />
                <Label htmlFor="vip">VIP Guest</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visits">Number of Visits</Label>
              <Input id="visits" type="number" {...register("visits", { valueAsNumber: true })} />
              {errors.visits && <p className="text-red-500 text-sm">{errors.visits.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{guest ? "Update Guest" : "Add Guest"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
