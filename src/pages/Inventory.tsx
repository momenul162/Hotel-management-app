import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { generateInventoryExport } from "../utils/exportUtils";
import { RequestRestockDialog } from "../components/inventory/RequestRestockDialog";
import { GenerateReportDialog } from "../components/inventory/GenerateReportDialog";
import { ViewSuppliersDialog } from "../components/inventory/ViewSuppliersDialog";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllInventoryItems } from "../redux/service/inventoryService";
import { Inventory } from "../types";
import { GuestCartSkeleton } from "../components/ui/skeleton/guest-card-skeleton";
import { InventoryRowSkeleton } from "../components/ui/skeleton/inventory-row-skeleton";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(fetchAllInventoryItems());
  }, [dispatch]);

  // Extract all unique categories
  const categories = Array.from(new Set(items.map((item: Inventory) => item.category)));

  // Filter inventory items based on search, categories, and current tab
  const filteredItems = items.filter((item: Inventory) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);

    const matchesTab =
      currentTab === "all" ||
      (currentTab === "low-stock" && item.quantity <= item.minimumQuantity) ||
      (currentTab === "well-stocked" && item.quantity > item.minimumQuantity);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Count low stock items
  const lowStockCount = items.filter(
    (item: Inventory) => item.quantity <= item.minimumQuantity
  ).length;

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    console.log("Deleting item with ID:", id);
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Last Restocked</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <>
                        {Array.from({ length: 8 }).map((_, index) => (
                          <InventoryRowSkeleton key={index} />
                        ))}
                      </>
                    )}
                    {!loading &&
                      filteredItems.map((item) => (
                        <TableRow key={item._id}>
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
                                    item.quantity <= item.minimumQuantity
                                      ? "text-destructive font-medium"
                                      : ""
                                  }
                                >
                                  {item.quantity}
                                </span>
                                {item.quantity <= item.minimumQuantity && (
                                  <Badge variant="destructive" className="text-xs">
                                    Low
                                  </Badge>
                                )}
                              </div>
                              <div className="w-full mt-1">
                                <Progress
                                  value={(item.quantity / (item.minimumQuantity * 2)) * 100}
                                  className={`h-1.5 ${
                                    item.quantity <= item.minimumQuantity
                                      ? "bg-destructive/20"
                                      : "bg-muted"
                                  }`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => console.log("Edit item", item._id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
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
                    <p className="text-2xl font-bold">{items.length}</p>
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
                      const count = items.filter((item) => item.category === category).length;
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
                  items={items.map((item) => ({
                    id: Number(item._id),
                    name: item.name,
                    supplier: item.supplier,
                  }))}
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
