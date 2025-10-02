import { api } from "./api";

export const agentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: () => ({
        url: "/agent/all",
        method: "GET",
      }),
      providesTags: ["Agent"],
    }),

    createAgent: builder.mutation({
      query: (data) => ({
        url: "/agent/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent", "Dashboard"],
    }),

    updateAgent: builder.mutation({
      query: (data) => ({
        url: `/agent/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Agent", "Dashboard"],
    }),

    deleteAgent: builder.mutation({
      query: (id) => ({
        url: `/agent/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agent", "Dashboard"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApi;
