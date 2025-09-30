import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/create",
        method: "POST",
        body: data,
      }),
    }),

    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),

    getAdmins: builder.query({
      query: () => ({
        url: "/admin/all",
        method: "GET",
      }),
    }),

    getAdminById: builder.query({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "GET",
      }),
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/delete/${id}`,
        method: "DELETE",
      }),
    }),

    updateAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useLoginAdminMutation,
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
} = adminApi;
