import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTracks = createAsyncThunk(
  "tracks/fetchTracks",
  async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tracks/");
      if (!res.ok) throw new Error("Failed to fetch tracks.");

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching tracks: ", err);
      throw err;
    }
  }
);

export const fetchTrackById = createAsyncThunk(
  "tracks/fetchTrackById",
  async (trackId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tracks/r/${trackId}/`);
      if (!res.ok) throw new Error("Failed to fetch track details.");

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching track details: ", err);
      throw err;
    }
  }
);

export const createTrack = createAsyncThunk(
  "tracks/createTrack",
  async (trackData) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tracks/c/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackData),
      });

      if (!res.ok) throw new Error("Failed to create track.");

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error creating track: ", err);
      throw err;
    }
  }
);

export const fetchTracksByUserId = createAsyncThunk(
  "tracks/fetchTracksByUserId",
  async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tracks/u/${userId}/`);
      if (!res.ok) throw new Error("Failed to fetch tracks for this user.");

      const data = await res.json();

      return data;
    } catch (err) {
      console.error("Error fetching tracks for this user: ", err);
      throw err;
    }
  }
);

export const stopTrack = createAsyncThunk(
  "tracks/stopTrack",
  async (trackId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tracks/stop/${trackId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to stop track.");

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error stopping track: ", err);
      throw err;
    }
  }
);

export const tracksSlice = createSlice({
  name: "tracks",
  initialState: {
    isLoading: false,
    isError: false,
    tracks: [],
    selectedTrack: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /** Fetching Tracks (All Tracks) */
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        console.error("Error fetching tracks: ", action.payload);
        state.isLoading = false;
        state.isError = true;
      })

      /** Fetching Track by ID  */
      .addCase(fetchTrackById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTrackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTrack = action.payload;
      })
      .addCase(fetchTrackById.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.selectedTrack = null;
      })

      /** Creating Track */
      .addCase(createTrack.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = [...state.tracks, action.payload];
      })
      .addCase(createTrack.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      /** Fetching Tracks by User ID */
      .addCase(fetchTracksByUserId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTracksByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracksByUserId.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      /** Stopping Track */
      .addCase(stopTrack.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(stopTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = state.tracks.map((track) => {
          if (track.id === action.payload.id) {
            return action.payload;
          }
          return track;
        });
      })
      .addCase(stopTrack.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default tracksSlice.reducer;
