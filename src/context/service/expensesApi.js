import { api } from "./api";

// router.get("/expense/all", ExpenseController.getExpenses);
// router.post("/expense/create", ExpenseController.createExpense);
// router.put("/expense/update/:id", ExpenseController.updateExpense);
// router.delete("/expense/delete/:id", ExpenseController.deleteExpense);

export const ExpenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: ({ startDate, endDate, type } = {}) => {
        const params = new URLSearchParams();

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (type) params.append("type", type);

        return `/expense/all?${params.toString()}`;
      },
      providesTags: ["Expense"],
    }),

    createExpense: builder.mutation({
      query: (data) => ({
        url: "/expense/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Expense", "Dashboard"],
    }),

    updateExpense: builder.mutation({
      query: (data) => ({
        url: `/expense/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Expense", "Dashboard"],
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expense/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Dashboard"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = ExpenseApi;
