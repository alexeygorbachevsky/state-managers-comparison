import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
const todosApi = createApi({
  tagTypes: ["Todos"],
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi/" }),
  endpoints: () => ({}),
});

export default todosApi;
