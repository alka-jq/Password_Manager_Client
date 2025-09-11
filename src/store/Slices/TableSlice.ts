// redux/dataSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../service/apiClient';
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';

// 🔹 Define type for a single item
export interface Item {
    id: string;
    title: string;
    type: string;
    isPinned?: boolean;

    // Add other fields based on your API response
}

// 🔹 Initial state type
interface DataState {
    items: Item[];
    loading: boolean;
    error: string | null;
}

// 🔹 Initial state
const initialState: DataState = {
    items: [],
    loading: false,
    error: null,
};

// 🔹 Thunk to fetch all data
export const fetchAlldata = createAsyncThunk('data/fetchAll', async () => {
    const res = await apiClient.get('/api/filter/all');
    return res.data?.data;
});

export const fetchcellIdData = createAsyncThunk('data/fetchCell', async (id: string) => {
    const res = await apiClient.get(`api/filter/all/${id}`)
    return res.data.data
})

export const fetchPersonalData = createAsyncThunk('data/fetchPersonal', async () => {
    const res = await apiClient.get('/api/password/state/personal')
    return res.data.data
})

// 🔹 Slice
const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlldata.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAlldata.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAlldata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Unknown error';
            })

            //fetch cell
            .addCase(fetchcellIdData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchcellIdData.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchcellIdData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Unknown error';
            })

            //fetch Personal Data
            .addCase(fetchPersonalData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalData.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPersonalData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Unknown error';
            })

    },
});

export default dataSlice.reducer;
