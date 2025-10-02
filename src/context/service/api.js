import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Bazaviy query
const rawBaseQuery = fetchBaseQuery({
  // baseUrl: "https://wherehouse.medme.uz/api",
  baseUrl: "http://localhost:4100/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom wrapper (errorlarni ushlash uchun)
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // faqat backend xato qaytarganda tekshiramiz
  if (result?.error?.data?.message) {
    const msg = result.error.data.message;

    if (msg === "invalid signature" || msg === "jwt expired") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return result;
};

// RTK Query API
export const api = createApi({
  reducerPath: "splitApi",
  baseQuery, // retry ni olib tashladik
  tagTypes: ["Agent", "Expense", "Ombor"],
  endpoints: () => ({}),
});
