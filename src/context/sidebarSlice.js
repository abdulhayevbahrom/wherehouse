import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: false,
  reducers: {
    toggleSidebar: (state) => (state = !state),
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
