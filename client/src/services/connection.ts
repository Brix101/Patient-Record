import { api } from "../app/api";

type Message = {
  msg: String;
};

const apiInitital = api.injectEndpoints({
  endpoints: (build) => ({
    connectionState: build.query<Message, String>({
      query: () => ({
        url: "/",
      }),
    }),
  }),
});

export const { useConnectionStateQuery } = apiInitital;
