import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const appointmentRouter = createProtectedRouter().query(
  "get-appointments",
  {
    async resolve({ ctx }) {
      if (ctx.session) {
        const appointments = await ctx.prisma.appointment.findMany({
          orderBy: {
            scheduleStart: "asc",
          },
        });
        return appointments;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  }
);
