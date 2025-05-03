import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "../../components/ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateBooking } from "../../redux/service/bookingService";
import { toast } from "sonner";

const ChangeStatus: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const props = state;
  const [openSheet, setOpenSheet] = useState(props.open);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = async (newStatus: string) => {
    setIsSubmitting(true);

    const result = await dispatch(
      updateBooking({ bookingData: { status: newStatus }, id: props.bookingId })
    );

    if (result.type.includes("fulfilled")) {
      toast.success("Reservation updated successfully!");
      navigate("/reservations");
      setOpenSheet(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!openSheet) {
      navigate("/reservations");
    }
  }, [openSheet]);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <button className="px-4 py-2 border rounded-md">Change Status: {props.status}</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change Reservation Status</SheetTitle>
        </SheetHeader>
        <div className="space-y-2 mt-4">
          <button
            onClick={() => handleStatusChange("confirmed")}
            disabled={props.status === "confirmed"}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusChange("checked-in")}
            disabled={props.status === "checked-in"}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Checked-in
          </button>
          <button
            onClick={() => handleStatusChange("checked-out")}
            disabled={props.status === "checked-out"}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Checked-out
          </button>
          <button
            onClick={() => handleStatusChange("canceled")}
            disabled={props.status === "canceled"}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Canceled
          </button>
        </div>
        <SheetFooter>
          {isSubmitting && (
            <SheetClose asChild onClick={() => navigate("/reservations")}>
              <button className="mt-4 px-4 py-2 bg-gray-200 rounded-md" disabled>
                Updating status...
              </button>
            </SheetClose>
          )}
          {!isSubmitting && (
            <SheetClose asChild onClick={() => navigate("/reservations")}>
              <button
                className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setOpenSheet(false)}
              >
                Close
              </button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChangeStatus;
