import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllInventoryItems,
  fetchInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../service/inventoryService";
import { Inventory } from "../../types";

interface InventoryState {
  items: Inventory[];
  currentItem: Inventory | null;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllInventoryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInventoryItems.fulfilled, (state, action: PayloadAction<Inventory[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllInventoryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch inventory items";
      })

      // Fetch one
      .addCase(fetchInventoryItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItemById.fulfilled, (state, action: PayloadAction<Inventory>) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchInventoryItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch inventory item";
      })

      // Create
      .addCase(createInventoryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInventoryItem.fulfilled, (state, action: PayloadAction<Inventory>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create inventory item";
      })

      // Update
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action: PayloadAction<Inventory>) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update inventory item";
      })

      // Delete
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete inventory item";
      });
  },
});

export default inventorySlice.reducer;
