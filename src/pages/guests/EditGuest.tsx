import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import { fetchGuestById, updateGuest } from "../../utils/api";
import { Guest } from "../../types";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function EditGuest() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadGuest = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // For demo, we'll get the guest from the dummy data
        const guest = await fetchGuestById(id);
        setGuest(guest);
      } catch (error) {
        console.error("Error loading guest:", error);
        toast.error("Failed to load guest details");
      } finally {
        setIsLoading(false);
      }
    };

    loadGuest();
  }, [id]);

  const handleChange = (field: keyof Guest, value: any) => {
    if (!guest) return;

    setGuest({
      ...guest,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!guest || !id) return;

    try {
      setIsSaving(true);

      // In a real app, this would update the backend
      await updateGuest(id, guest);

      toast.success("Guest information updated successfully");
      navigate("/guests");
    } catch (error) {
      console.error("Error saving guest:", error);
      toast.error("Failed to update guest information");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin mb-4">⌛</div>
            <p>Loading guest information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!guest) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Guest not found</h2>
          <p className="text-muted-foreground mb-6">
            The guest you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/guests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guests
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Edit Guest</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update guest information and preferences
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/guests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guests
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Edit the guest's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={guest.avatar} alt={guest.name} />
                  <AvatarFallback className="text-lg">
                    {guest.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, GIF or PNG. Max size of 3MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={guest.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guest.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={guest.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={guest.nationality}
                    onChange={(e) => handleChange("nationality", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID/Passport Number</Label>
                  <Input
                    id="idNumber"
                    value={guest.idNumber}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visits">Number of Visits</Label>
                  <Input
                    id="visits"
                    type="number"
                    min="0"
                    value={guest.visits}
                    onChange={(e) => handleChange("visits", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or notes about the guest"
                  rows={4}
                  value={guest.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate("/guests")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest Status</CardTitle>
              <CardDescription>Update guest's status and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="vip">VIP Status</Label>
                  <p className="text-sm text-muted-foreground">Mark guest as a VIP</p>
                </div>
                <Switch
                  id="vip"
                  checked={guest.vip}
                  onCheckedChange={(checked) => handleChange("vip", checked)}
                />
              </div>

              <Separator />

              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2 mb-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Guest Statistics</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Stays:</span>
                    <span className="font-medium">{guest.visits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <span className="font-medium">2023-05-18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preferred Room:</span>
                    <span className="font-medium">Deluxe Suite</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium">$2,450.00</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => navigate(`/guests/book/${id}`)}
                >
                  Book New Stay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
