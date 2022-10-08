// src/server/router/index.ts
import { appointmentRouter } from "@server/router/appointment.router";
import { authRouter } from "@server/router/auth.router";
import { createRouter } from "@server/router/context";
import { exampleRouter } from "@server/router/example";
import { mediceneRouter } from "@server/router/medicine.router";
import { patientRouter } from "@server/router/patient.router";
import { protectedExampleRouter } from "@server/router/protected-example-router";
import { roomRouter } from "@server/router/room.router";
import { usersRouter } from "@server/router/user.router";
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("appointment.", appointmentRouter)
  .merge("auth.", authRouter)
  .merge("medicine.", mediceneRouter)
  .merge("patient.", patientRouter)
  .merge("room.", roomRouter)
  .merge("users.", usersRouter)
  .merge("example.", exampleRouter)
  .merge("authExample.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
