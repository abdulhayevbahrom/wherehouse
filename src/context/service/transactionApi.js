import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveProductsToAgent: builder.mutation({
      query: (data) => ({
        url: "/transaction/give",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Ombor", "Supplier"],
    }),

    payDebt: builder.mutation({
      query: (data) => ({
        url: "/transaction/pay",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Supplier"],
    }),

    // /transaction/all
    getAllTransactions: builder.query({
      query: () => "/transaction/all",
      providesTags: ["Agent"],
    }),

    // debtors
    getDebtors: builder.query({
      query: () => "/debtors",
      providesTags: ["Agent"],
    }),
  }),
});

export const {
  useGiveProductsToAgentMutation,
  usePayDebtMutation,
  useGetAllTransactionsQuery,
  useGetDebtorsQuery,
} = adminApi;
