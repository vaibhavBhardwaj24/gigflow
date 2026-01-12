import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface GigState {
  gigs: Gig[];
  currentGig: Gig | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: GigState = {
  gigs: [],
  currentGig: null,
  loading: false,
  error: null,
  searchQuery: "",
};

export const fetchGigs = createAsyncThunk(
  "gigs/fetchGigs",
  async (search?: string) => {
    const url = search ? `/api/gigs?search=${search}` : "/api/gigs";
    const response = await api.get(url);
    return response.data.gigs;
  }
);

export const fetchGigById = createAsyncThunk(
  "gigs/fetchGigById",
  async (id: string) => {
    const response = await api.get(`/api/gigs/${id}`);
    return response.data.gig;
  }
);

export const createGig = createAsyncThunk(
  "gigs/createGig",
  async (gigData: { title: string; description: string; budget: number }) => {
    const response = await api.post("/api/gigs", gigData);
    return response.data.gig;
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGigs.fulfilled, (state, action: PayloadAction<Gig[]>) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch gigs";
      })
      .addCase(fetchGigById.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.currentGig = action.payload;
      })
      .addCase(createGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.gigs.unshift(action.payload);
      });
  },
});

export const { setSearchQuery, clearCurrentGig } = gigSlice.actions;
export default gigSlice.reducer;
