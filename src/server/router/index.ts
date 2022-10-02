// src/server/router/index.ts
import { createRouter } from "@server/router/context";
import { exampleRouter } from "@server/router/example";
import { protectedExampleRouter } from "@server/router/protected-example-router";
import { usersRouter } from "@server/router/user.router";
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("users.", usersRouter)
  .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
