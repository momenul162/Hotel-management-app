import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";
import { InventoryCreate } from "../../types";

interface InventoryUpdate extends Partial<InventoryCreate> {}

// Fetch all inventory items
export const fetchAllInventoryItems = createAsyncThunk("inventory/fetchAll", async () => {
  const { data } = await baseURL.get("/inventory");
  return data;
});

// Fetch inventory item by ID
export const fetchInventoryItemById = createAsyncThunk(
  "inventory/fetchById",
  async (id: string) => {
    const { data } = await baseURL.get(`/inventory/${id}`);
    return data;
  }
);

// Create inventory item
export const createInventoryItem = createAsyncThunk(
  "inventory/create",
  async (itemData: InventoryCreate) => {
    const { data } = await baseURL.post("/inventory/create", itemData);
    return data;
  }
);

// Update inventory item
export const updateInventoryItem = createAsyncThunk(
  "inventory/update",
  async ({ id, itemData }: { id: string; itemData: InventoryUpdate }) => {
    const { data } = await baseURL.patch(`/inventory/update/${id}`, itemData);
    return data;
  }
);

// Delete inventory item
export const deleteInventoryItem = createAsyncThunk("inventory/delete", async (id: string) => {
  await baseURL.delete(`/inventory/${id}`);
  return id;
});
