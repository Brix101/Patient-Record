import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const dashboardRouter = createProtectedRouter().query("analytics", {
  resolve: async ({ ctx }) => {
    if (ctx.session) {
      const users = await ctx.prisma.user.count();
      const userRole = await ctx.prisma.user.groupBy({
        by: ["role"],
        _count: {
          _all: true,
        },
      });

      const patients = await ctx.prisma.patient.count();

      const medicalRecord = await ctx.prisma.medicalRecord.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      });

      return { users, userRole, patients, medicalRecord };
    }
    throw new trpc.TRPCError({
      code: "UNAUTHORIZED",
      message: "Please Login",
    });
  },
});
