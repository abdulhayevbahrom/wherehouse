import { api } from "./api";

export const omborApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOmbor: builder.query({
      query: () => "/ombor/all",
      providesTags: ["Ombor"],
    }),

    createOmbor: builder.mutation({
      query: (data) => ({
        url: "/ombor/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ombor"],
    }),

    updateOmbor: builder.mutation({
      query: (data) => ({
        url: `/ombor/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Ombor"],
    }),

    deleteOmbor: builder.mutation({
      query: (id) => ({
        url: `/ombor/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ombor"],
    }),

    // /ombor/supplier/:id"
    getOmborBySupplier: builder.query({
      query: (id) => `/ombor/supplier/${id}`,
      providesTags: ["Ombor"],
    }),

    // /ombor/pay/:supplierId/:omborId

    paySupplierDebt: builder.mutation({
      query: (data) => ({
        url: `/ombor/pay/${data.supplierId}/${data.omborId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ombor"],
    }),
  }),
});

export const {
  useGetOmborQuery,
  useCreateOmborMutation,
  useUpdateOmborMutation,
  useDeleteOmborMutation,
  useGetOmborBySupplierQuery,
  usePaySupplierDebtMutation,
} = omborApi;
