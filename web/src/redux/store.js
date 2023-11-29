import { configureStore } from "@reduxjs/toolkit";

import projectsReducer from "./projects/reducer";
import usersReducer from "./users/reducer";
import tracksReducer from "./tracks/reducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    projects: projectsReducer,
    tracks: tracksReducer,
  },
});
