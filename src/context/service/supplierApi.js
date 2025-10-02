import { api } from "./api";
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

    // /supplier/update/:id

    updateSupplier: builder.mutation({
      query: ({ _id, data }) => ({
        url: `/supplier/update/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} = agentApi;
