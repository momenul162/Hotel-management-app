import { useState } from "react";
import { Building, ExternalLink, PhoneCall, Mail, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Define supplier interface
interface Supplier {
  name: string;
  contact: string;
  phone: string;
  email: string;
  categories: string[];
  itemCount: number;
}

// Sample supplier data - in a real app this would come from an API
const supplierData: Supplier[] = [
  {
    name: "Luxury Textiles Inc.",
    contact: "John Smith",
    phone: "(555) 123-4567",
    email: "john@luxurytextiles.com",
    categories: ["Linens", "Bedding"],
    itemCount: 12,
  },
  {
    name: "EcoClean Products",
    contact: "Jane Doe",
    phone: "(555) 987-6543",
    email: "jane@ecoclean.com",
    categories: ["Toiletries", "Cleaning Supplies"],
    itemCount: 25,
  },
  {
    name: "Bath Essentials Co.",
    contact: "Robert Johnson",
    phone: "(555) 456-7890",
    email: "robert@bathessentials.com",
    categories: ["Toiletries"],
    itemCount: 18,
  },
  {
    name: "Guest Comfort Supplies",
    contact: "Sarah Williams",
    phone: "(555) 321-6549",
    email: "sarah@guestcomfort.com",
    categories: ["Amenities", "Room Accessories"],
    itemCount: 32,
  },
  {
    name: "Beverage Solutions",
    contact: "Michael Brown",
    phone: "(555) 789-1234",
    email: "michael@beveragesolutions.com",
    categories: ["Amenities", "Food & Beverage"],
    itemCount: 15,
  },
  {
    name: "Sleep Well Inc.",
    contact: "Emily Jones",
    phone: "(555) 654-9871",
    email: "emily@sleepwell.com",
    categories: ["Bedding"],
    itemCount: 8,
  },
  {
    name: "Hotel Furnishings Ltd.",
    contact: "David Miller",
    phone: "(555) 234-5678",
    email: "david@hotelfurnishings.com",
    categories: ["Room Accessories", "Furniture"],
    itemCount: 19,
  },
];

export function ViewSuppliersDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract all unique categories
  const allCategories = Array.from(
    new Set(supplierData.flatMap((supplier) => supplier.categories))
  ).sort();

  // Filter suppliers based on search term and selected category
  const filteredSuppliers = supplierData.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || supplier.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Building className="mr-2 h-4 w-4" />
          View Suppliers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inventory Suppliers</DialogTitle>
          <DialogDescription>
            View and filter all suppliers for your inventory items
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory ? (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                {selectedCategory} ×
              </Badge>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center">
                Filter by category:
              </div>
            )}
            {!selectedCategory &&
              allCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No suppliers found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.name}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>
                      <div>{supplier.contact}</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <PhoneCall className="h-3 w-3 mr-1" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{supplier.itemCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
