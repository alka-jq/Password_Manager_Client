// features/cells/cellSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/service/apiClient";

export type Cell = {
  id: string;
  key?: string;
  name: string;
  icon: string;
  color: string;
  path?: string;
};

interface CellState {
  cells: Cell[];
  loading: boolean;
  error: string | null;
}

const initialState: CellState = {
  cells: [],
  loading: false,
  error: null,
};

//  Thunk to create a cell
export const createCell = createAsyncThunk<Cell, Omit<Cell, "id">, { rejectValue: string }>(
  "cells/createCell",
  async (cell, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/cell/create", {
        title: cell.name,
        color: cell.color,
        icon: cell.icon,
      });

      const data = response.data;
      const newCell: Cell = {
        id: data.cell.id,
        name: data.cell.title,
        color: data.cell.color,
        icon: data.cell.icon,
      };
      return newCell;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create cell");
    }
  }
);

//  Thunk to fetch cells via GET
export const fetchCells = createAsyncThunk<Cell[], void, { rejectValue: string }>(
  "cells/fetchCells",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/getCell");
      const data = response.data;

      // Adjust if endpoint returns differently, e.g., data.cellList or similar
      const fetched: Cell[] = data.cells.map((c: any) => ({
        id: c.id,
        name: c.title,
        color: c.color,
        icon: c.icon,
      }));

      return fetched;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cells");
    }
  }
);

const cellSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    setCells(state, action: PayloadAction<Cell[]>) {
      state.cells = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // createCell lifecycle
      .addCase(createCell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCell.fulfilled, (state, action) => {
        state.cells.push(action.payload);
        state.loading = false;
      })
      .addCase(createCell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      // fetchCells lifecycle
      .addCase(fetchCells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.cells = action.payload;
        state.loading = false;
      })
      .addCase(fetchCells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      });
  },
});

export const { setCells } = cellSlice.actions;
export default cellSlice.reducer;
