import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Edit, Mail, MoreHorizontal, Phone, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { AddStaffDialog } from "../components/staff/AddStaffDialog";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { DashboardLayout } from "../components/layout/DashboardLayout";

// Sample staff data
const staffMembers = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@luxurysuites.com",
    phone: "+1 (555) 123-4567",
    role: "Hotel Manager",
    department: "Management",
    avatar: "",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@luxurysuites.com",
    phone: "+1 (555) 234-5678",
    role: "Front Desk Manager",
    department: "Front Office",
    avatar: "",
    status: "active",
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    email: "sofia.rodriguez@luxurysuites.com",
    phone: "+1 (555) 345-6789",
    role: "Housekeeping Supervisor",
    department: "Housekeeping",
    avatar: "",
    status: "active",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@luxurysuites.com",
    phone: "+1 (555) 456-7890",
    role: "Maintenance Technician",
    department: "Maintenance",
    avatar: "",
    status: "on-leave",
  },
  {
    id: 5,
    name: "Olivia Davis",
    email: "olivia.davis@luxurysuites.com",
    phone: "+1 (555) 567-8901",
    role: "Chef",
    department: "Food & Beverage",
    avatar: "",
    status: "active",
  },
  {
    id: 6,
    name: "James Johnson",
    email: "james.johnson@luxurysuites.com",
    phone: "+1 (555) 678-9012",
    role: "Security Officer",
    department: "Security",
    avatar: "",
    status: "inactive",
  },
];

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStaff = (id: number) => {
    toast.info(`Edit staff member with ID: ${id}`);
  };

  const handleDeleteStaff = (id: number) => {
    toast.success(`Staff member with ID: ${id} removed`);
  };

  const handleViewDetails = (staff: any) => {
    setSelectedStaff(staff);
    setViewDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Staff Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage staff members and their permissions
            </p>
          </div>
          <AddStaffDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Staff Directory</CardTitle>
                  <CardDescription>View and manage all staff members</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search staff..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStaff.map((staff) => (
                  <Card key={staff.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start p-4">
                        <Avatar className="h-12 w-12 mr-4 border">
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <button
                                className="font-semibold hover:underline text-left"
                                onClick={() => handleViewDetails(staff)}
                              >
                                {staff.name}
                              </button>
                              <p className="text-sm text-muted-foreground">{staff.role}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(staff)}>
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditStaff(staff.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteStaff(staff.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove staff
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <Badge
                            variant={
                              staff.status === "active"
                                ? "default"
                                : staff.status === "on-leave"
                                ? "outline"
                                : "secondary"
                            }
                            className="mt-1"
                          >
                            {staff.status === "active"
                              ? "Active"
                              : staff.status === "on-leave"
                              ? "On Leave"
                              : "Inactive"}
                          </Badge>
                          <div className="mt-3 space-y-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 mr-2" />
                              {staff.email}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 mr-2" />
                              {staff.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/40 px-4 py-2 text-xs">
                        <span className="font-medium">Department:</span> {staff.department}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
              <CardDescription>Quick staff statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center">
                <Card className="p-4">
                  <p className="text-3xl font-bold">{staffMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                </Card>
                <Card className="p-4">
                  <p className="text-3xl font-bold">
                    {staffMembers.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </Card>
                <Card className="p-4">
                  <p className="text-3xl font-bold">
                    {staffMembers.filter((s) => s.status === "on-leave").length}
                  </p>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                </Card>
                <Card className="p-4">
                  <p className="text-3xl font-bold">
                    {staffMembers.filter((s) => s.status === "inactive").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Departments</h3>
                <div className="space-y-2">
                  {Array.from(new Set(staffMembers.map((s) => s.department))).map((dept) => (
                    <div key={dept} className="flex justify-between items-center text-sm">
                      <span>{dept}</span>
                      <Badge variant="secondary">
                        {staffMembers.filter((s) => s.department === dept).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Staff Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>Detailed information about the staff member</DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                  <AvatarFallback className="text-lg">
                    {selectedStaff.name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{selectedStaff.name}</h2>
                  <p className="text-sm font-medium">{selectedStaff.role}</p>
                  <p className="text-sm text-muted-foreground">{selectedStaff.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedStaff.phone}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="outline">{selectedStaff.department}</Badge>
                    <Badge
                      variant={
                        selectedStaff.status === "active"
                          ? "default"
                          : selectedStaff.status === "on-leave"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {selectedStaff.status === "active"
                        ? "Active"
                        : selectedStaff.status === "on-leave"
                        ? "On Leave"
                        : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Job Responsibilities</Label>
                  <p className="mt-1 text-sm">
                    {selectedStaff.role === "Hotel Manager"
                      ? "Overall management of hotel operations, staff supervision, and strategic planning."
                      : selectedStaff.role === "Front Desk Manager"
                      ? "Managing reception staff, guest check-ins/check-outs, and customer service operations."
                      : "Responsibilities based on department and role."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Start Date</Label>
                    <p className="text-sm">January 15, 2022</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Shift</Label>
                    <p className="text-sm">Morning (8AM - 4PM)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Last login: Today, 9:30 AM</p>
                  <p className="text-xs text-muted-foreground">Tasks completed this week: 12</p>
                  <p className="text-xs text-muted-foreground">
                    Next scheduled shift: Tomorrow, 8:00 AM
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleEditStaff(selectedStaff.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteStaff(selectedStaff.id);
                    setViewDetailsOpen(false);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove Staff
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
