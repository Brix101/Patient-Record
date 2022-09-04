import { api } from "../app/api";

const apiInitital = api.injectEndpoints({
  endpoints: (build) => ({
    connectionState: build.query({
      query: () => ({
        url: "/",
      }),
    }),
  }),
});

export const { useConnectionStateQuery } = apiInitital;
