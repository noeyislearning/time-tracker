import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects", 
  async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/projects/")
    if (!res.ok) throw new Error("Failed to fetch projects.")

    const data = await res.json()
    return data
  }
  catch (err) {
    console.error("Error fetching projects: ", err)
    throw err
  }
})

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/rwt/${projectId}/`)
      if (!res.ok) throw new Error('Failed to fetch project details.')

      const data = await res.json()
      return data
    } catch (err) {
        console.error("Error fetching project details: ", err)
      throw err 
    }
  }
)


export const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    isLoading: false,
    isError: false,
    projects: [],
    selectedProject: null
  },
  reducer: {},
  extraReducers: (builder) => {
    /** Fetch Projects */
    builder
      // Set isLoading to true and isError to false when the fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      // Store the fetched projects in the projects array
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
      })
      // Reset the state to the initial state if there is an error
      .addCase(fetchProjects.rejected, (state, action) => {
        console.error("Error fetching projects: ", action.payload)
        state.isError = true
      }),
    /** Fetch Project by ID */
    builder
      // Set isLoading to true and isError to false when the fetchProjectById
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      // Store the fetched project with ID in the projects array
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProject = action.payload
      })
      // Reset the state to the initial state if there is an error
      .addCase(fetchProjectById.rejected, (state) => {
        state.isLoading = false
        state.isError = true
        state.selectedProject = null
      })
  }
})

export default projectsSlice.reducer