// store/Slices/countSlice.ts
import apiClient from '@/service/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CountData {
    all_items_count: number;
    personal_count: number;
    pin_count: number;
    trash_count: number;
}

interface CountState {
    count: CountData | null;
    loading: boolean;
    error: string | null;
}

const initialState: CountState = {
    count: null,
    loading: false,
    error: null,
};

// 🔹 Thunk to fetch count
export const fetchItemCount = createAsyncThunk('count/fetchItemCount', async () => {
    const res = await apiClient.get('/api/password/items-count');
    console.log("hello", res)
    return res.data.counts;
});

const countSlice = createSlice({
    name: 'count',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemCount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemCount.fulfilled, (state, action) => {
                state.loading = false;
                state.count = action.payload;
            })
            .addCase(fetchItemCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch counts';
            });
    },
});

export default countSlice.reducer;
