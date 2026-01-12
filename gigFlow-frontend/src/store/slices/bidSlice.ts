import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface Bid {
  _id: string;
  gigId:
    | string
    | { _id: string; title: string; budget: number; status: string };
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  proposedPrice: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
}

interface BidState {
  bids: Bid[];
  myBids: Bid[];
  loading: boolean;
  error: string | null;
}

const initialState: BidState = {
  bids: [],
  myBids: [],
  loading: false,
  error: null,
};

export const submitBid = createAsyncThunk(
  "bids/submitBid",
  async (bidData: {
    gigId: string;
    message: string;
    proposedPrice: number;
  }) => {
    const response = await api.post("/api/bids", bidData);
    return response.data.bid;
  }
);

export const fetchBidsForGig = createAsyncThunk(
  "bids/fetchBidsForGig",
  async (gigId: string) => {
    const response = await api.get(`/api/bids/gig/${gigId}`);
    return response.data.bids;
  }
);

export const fetchMyBids = createAsyncThunk("bids/fetchMyBids", async () => {
  const response = await api.get("/api/bids/my-bids");
  console.log("fetchMyBids response:", response.data);
  console.log("fetchMyBids bids:", response.data.bids);
  return response.data.bids;
});

export const hireBid = createAsyncThunk(
  "bids/hireBid",
  async (bidId: string) => {
    const response = await api.patch(`/api/bids/${bidId}/hire`);
    return response.data.bid;
  }
);

const bidSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    clearBids: (state) => {
      state.bids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.loading = false;
        state.bids.push(action.payload);
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit bid";
      })
      .addCase(
        fetchBidsForGig.fulfilled,
        (state, action: PayloadAction<Bid[]>) => {
          state.bids = action.payload;
        }
      )
      .addCase(fetchMyBids.fulfilled, (state, action: PayloadAction<Bid[]>) => {
        state.myBids = action.payload;
      })
      .addCase(hireBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        const index = state.bids.findIndex(
          (bid) => bid._id === action.payload._id
        );
        if (index !== -1) {
          state.bids[index] = action.payload;
          state.bids.forEach((bid, i) => {
            if (i !== index && bid.status === "pending") {
              bid.status = "rejected";
            }
          });
        }
      });
  },
});

export const { clearBids } = bidSlice.actions;
export default bidSlice.reducer;
