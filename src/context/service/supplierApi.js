import { api } from "../api";
export const agentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => "/supplier/all",
      providesTags: ["Supplier"],
    }),

    // /supplier/suppliers

    getSuppliers: builder.query({
      query: () => "/supplier/suppliers",
      providesTags: ["Supplier"],
    }),
  }),
});

export const { useGetAllQuery, useGetSuppliersQuery } = agentApi;
