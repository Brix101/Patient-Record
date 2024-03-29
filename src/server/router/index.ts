// src/server/router/index.ts
import { appointmentRouter } from "@server/router/appointment.router";
import { authRouter } from "@server/router/auth.router";
import { billingRouter } from "@server/router/billing.router";
import { createRouter } from "@server/router/context";
import { dashboardRouter } from "@server/router/dashboard.router";
import { exampleRouter } from "@server/router/example";
import { logsRouter } from "@server/router/log.router";
import { medicalRecordRouter } from "@server/router/medicalRecord.router";
import { mediceneRouter } from "@server/router/medicine.router";
import { patientRouter } from "@server/router/patient.router";
import { physiciansRouter } from "@server/router/physician.router";
import { roomRouter } from "@server/router/room.router";
import { usersRouter } from "@server/router/user.router";
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("appointment.", appointmentRouter)
  .merge("auth.", authRouter)
  .merge("billing.", billingRouter)
  .merge("logs.", logsRouter)
  .merge("dashboard.", dashboardRouter)
  .merge("medicalRecord.", medicalRecordRouter)
  .merge("medicine.", mediceneRouter)
  .merge("patient.", patientRouter)
  .merge("physician.", physiciansRouter)
  .merge("room.", roomRouter)
  .merge("users.", usersRouter)
  .merge("example.", exampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
