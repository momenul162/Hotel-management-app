import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Box, Download, PackagePlus, Search, SlidersHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { fetchInventory, deleteInventoryItem } from "../utils/api";
import { generateInventoryExport } from "../utils/exportUtils";
import { RequestRestockDialog } from "../components/inventory/RequestRestockDialog";
import { GenerateReportDialog } from "../components/inventory/GenerateReportDialog";
import { ViewSuppliersDialog } from "../components/inventory/ViewSuppliersDialog";
import { DashboardLayout } from "../components/layout/DashboardLayout";

// Define interface for inventory items
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");

  const {
    data: inventoryItems = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
    placeholderData: [
      {
        id: "1",
        name: "Bath Towels",
        category: "Linens",
        quantity: 245,
        minimumStock: 100,
        unitPrice: 12.99,
        supplier: "Luxury Textiles Inc.",
        lastRestocked: "2023-10-15",
      },
      {
        id: "2",
        name: "Hand Soap",
        category: "Toiletries",
        quantity: 178,
        minimumStock: 50,
        unitPrice: 3.49,
        supplier: "EcoClean Products",
        lastRestocked: "2023-11-02",
      },
      {
        id: "3",
        name: "Bed Sheets (King)",
        category: "Linens",
        quantity: 89,
        minimumStock: 60,
        unitPrice: 45.0,
        supplier: "Luxury Textiles Inc.",
        lastRestocked: "2023-10-22",
      },
      {
        id: "4",
        name: "Shampoo Bottles",
        category: "Toiletries",
        quantity: 312,
        minimumStock: 150,
        unitPrice: 2.25,
        supplier: "Bath Essentials Co.",
        lastRestocked: "2023-11-12",
      },
      {
        id: "5",
        name: "Slippers",
        category: "Amenities",
        quantity: 132,
        minimumStock: 100,
        unitPrice: 5.99,
        supplier: "Guest Comfort Supplies",
        lastRestocked: "2023-09-28",
      },
      {
        id: "6",
        name: "Coffee Pods",
        category: "Amenities",
        quantity: 430,
        minimumStock: 200,
        unitPrice: 0.75,
        supplier: "Beverage Solutions",
        lastRestocked: "2023-11-05",
      },
      {
        id: "7",
        name: "Pillows",
        category: "Bedding",
        quantity: 45,
        minimumStock: 40,
        unitPrice: 22.5,
        supplier: "Sleep Well Inc.",
        lastRestocked: "2023-10-10",
      },
      {
        id: "8",
        name: "Toilet Paper",
        category: "Toiletries",
        quantity: 540,
        minimumStock: 300,
        unitPrice: 0.99,
        supplier: "EcoClean Products",
        lastRestocked: "2023-11-15",
      },
      {
        id: "9",
        name: "Hangers",
        category: "Room Accessories",
        quantity: 320,
        minimumStock: 200,
        unitPrice: 1.5,
        supplier: "Hotel Furnishings Ltd.",
        lastRestocked: "2023-09-15",
      },
      {
        id: "10",
        name: "Laundry Bags",
        category: "Amenities",
        quantity: 210,
        minimumStock: 100,
        unitPrice: 0.85,
        supplier: "Guest Comfort Supplies",
        lastRestocked: "2023-10-28",
      },
    ],
  });

  // Extract all unique categories
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)));

  // Filter inventory items based on search, categories, and current tab
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);

    const matchesTab =
      currentTab === "all" ||
      (currentTab === "low-stock" && item.quantity <= item.minimumStock) ||
      (currentTab === "well-stocked" && item.quantity > item.minimumStock);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Count low stock items
  const lowStockCount = inventoryItems.filter((item) => item.quantity <= item.minimumStock).length;

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      toast.success("Item deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  // Handle export
  const handleExport = (format: "csv" | "xlsx" | "json") => {
    try {
      generateInventoryExport(filteredItems, format, {
        filename: `inventory-export-${new Date().toISOString().split("T")[0]}`,
        selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
      });

      toast.success(`Inventory exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export inventory");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Inventory Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage hotel supplies and inventory items
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem onClick={() => handleExport("xlsx")}>
                  Excel (.xlsx)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleExport("csv")}>
                  CSV (.csv)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleExport("json")}>
                  JSON (.json)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate("/inventory/add")}>
              <PackagePlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <Card className="xl:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>{filteredItems.length} items found</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-shrink-0">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {categories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== category)
                              );
                            }
                          }}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Tabs className="mt-4" defaultValue="all" onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low-stock" className="relative">
                    Low Stock
                    {lowStockCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {lowStockCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="well-stocked">Well Stocked</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-muted-foreground">Loading inventory items...</p>
                </div>
              ) : isError ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-destructive">Error loading inventory items</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Last Restocked</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No inventory items found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={
                                      item.quantity <= item.minimumStock
                                        ? "text-destructive font-medium"
                                        : ""
                                    }
                                  >
                                    {item.quantity}
                                  </span>
                                  {item.quantity <= item.minimumStock && (
                                    <Badge variant="destructive" className="text-xs">
                                      Low
                                    </Badge>
                                  )}
                                </div>
                                <div className="w-full mt-1">
                                  <Progress
                                    value={(item.quantity / (item.minimumStock * 2)) * 100}
                                    className={`h-1.5 ${
                                      item.quantity <= item.minimumStock
                                        ? "bg-destructive/20"
                                        : "bg-muted"
                                    }`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>{item.supplier}</TableCell>
                            <TableCell>
                              {new Date(item.lastRestocked).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => console.log("Edit item", item.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-4">
                    <Box className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-2xl font-bold">{inventoryItems.length}</p>
                    <p className="text-xs text-muted-foreground">Total Items</p>
                  </Card>
                  <Card className="p-4">
                    <Box className="h-5 w-5 text-destructive mb-2" />
                    <p className="text-2xl font-bold">{lowStockCount}</p>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                  </Card>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const count = inventoryItems.filter(
                        (item) => item.category === category
                      ).length;
                      return (
                        <div key={category} className="flex justify-between items-center text-sm">
                          <span>{category}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 border rounded-md">
                      <p className="font-medium">Restocked Bath Towels</p>
                      <p className="text-xs text-muted-foreground">Nov 25, 2023</p>
                    </div>
                    <div className="p-2 border rounded-md">
                      <p className="font-medium">Ordered Shampoo Bottles</p>
                      <p className="text-xs text-muted-foreground">Nov 22, 2023</p>
                    </div>
                    <div className="p-2 border rounded-md">
                      <p className="font-medium">Updated Pillow Inventory</p>
                      <p className="text-xs text-muted-foreground">Nov 20, 2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <RequestRestockDialog
                  items={inventoryItems.map((item) => ({
                    id: Number(item.id),
                    name: item.name,
                    supplier: item.supplier,
                  }))}
                  onSuccess={() => refetch()}
                />
                <GenerateReportDialog
                  categories={categories as string[]}
                  onSuccess={() => toast.success("Report generated successfully")}
                />
                <ViewSuppliersDialog />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
