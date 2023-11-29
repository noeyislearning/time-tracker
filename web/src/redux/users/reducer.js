import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialUser = {
  id: null,
  email: '',
  user_name: '',
  first_name: '',
  last_name: '',
  start_date: null, // Date or timestamp
  is_staff: false,
  is_active: true,
  is_login: false,
  created_at: null, // Date or timestamp
  updated_at: null, // Date or timestamp
};

const initialState = {
  isLoading: false,
  isError: false,
  user: initialUser, // Use the defined initialUser
  token: null
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })
      if (!res.ok) {
        // If response status is not OK, handle server errors here
        const errorData = await res.json();
        // Returning the error data to be caught by the rejected action
        return rejectWithValue(errorData);
      }

      const data = await res.json()
      return data
    } catch (err) {
        console.error("Error registering user: ", err)
      throw err
    }
  }
)

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })
      if (!res.ok) {
        // If response status is not OK, handle server errors here
        const errorData = await res.json();
        // Returning the error data to be caught by the rejected action
        return rejectWithValue(errorData);
      }

      const data = await res.json()
      return data
    } catch (err) {
        console.error("Error logging in user: ", err)
      throw err
    }
  }
)

export const logoutUser = createAsyncThunk(
  "users/logoutUser",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/logout/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${refreshToken}`, // Include access token in headers
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData);
      }
      return true;
    } catch (err) {
      console.error("Error logging out user: ", err);
      throw err;
    }
  }
);

export const fetchUserData = async (accessToken) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/user-data/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};


export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const userData = await fetchUserData(accessToken); // Utilize fetchUserData function

      return userData;
    } catch (error) {
      console.error("Error fetching user details: ", error);
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setTokensFromStorage: (state, action) => {
      state.token = action.payload.accessToken
      state.user = action.payload.user
    },
    setUserFromLocalStorage: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    /** Register User */
    builder
      // Set isLoading to true and isError to false when the registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      // Store the fetched user in the user object
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      // Reset the state to the initial state if there is an error
      .addCase(registerUser.rejected, (state, action) => {
        console.error("Error registering user: ", action.payload)
        state.isLoading = false
        state.isError = true
        state.serverError = action.payload
      }),

    /** Login User */
    builder
      // Set isLoading to true and isError to false when the loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      // Store the fetched user in the user object
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = {
          id: action.payload.user_id,
          email: action.payload.email,
          userName: action.payload.user_name,
          firstName: action.payload.first_name,
          lastName: action.payload.last_name,
          isLoggedIn: action.payload.is_login
        };
        state.token = action.payload.access
        state.serverError = null
      })
      // Reset the state to the initial state if there is an error
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Error logging in user: ", action.payload)
        state.isLoading = false
        state.isError = true
        state.serverError = action.payload
      }),

    /** Logout User */
    builder
      // Set isLoading to true and isError to false when the logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      // Reset the state to the initial state if the logoutUser is successful
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = initialUser
        state.token = null
      })
      // Reset the state to the initial state if there is an error
      .addCase(logoutUser.rejected, (state, action) => {
        console.error("Error logging out user: ", action.payload)
        state.isLoading = false
        state.isError = true
        state.serverError = action.payload
      }),

    /** Fetch User Details */
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        console.error("Error fetching user details: ", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.serverError = action.payload;
      })
  }
})

export const { setTokensFromStorage, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer