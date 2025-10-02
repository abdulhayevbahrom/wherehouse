import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    giveProductsToAgent: builder.mutation({
      query: (data) => ({
        url: "/transaction/give",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Ombor", "Supplier", "Dashboard"],
    }),

    payDebt: builder.mutation({
      query: (data) => ({
        url: "/transaction/pay",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Supplier", "Ombor", "Dashboard"],
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

    // /agent/debts/:agentId
    getAgentDebts: builder.query({
      query: (agentId) => `/agent/debts/${agentId}`,
      providesTags: ["Agent"],
    }),
  }),
});

export const {
  useGiveProductsToAgentMutation,
  usePayDebtMutation,
  useGetAllTransactionsQuery,
  useGetDebtorsQuery,
  useGetAgentDebtsQuery,
} = adminApi;
