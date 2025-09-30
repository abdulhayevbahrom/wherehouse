import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveProductsToAgent: builder.mutation({
      query: (data) => ({
        url: "/transaction/give",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Ombor"],
    }),

    payDebt: builder.mutation({
      query: (data) => ({
        url: "/transaction/pay",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent"],
    }),

    // /transaction/all
    getAllTransactions: builder.query({
      query: () => "/transaction/all",
      providesTags: ["Agent"],
    }),
  }),
});

export const {
  useGiveProductsToAgentMutation,
  usePayDebtMutation,
  useGetAllTransactionsQuery,
} = adminApi;
