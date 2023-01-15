import { searchLogchema } from "@/schema/log.schema";
import { Role } from "@prisma/client";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const logsRouter = createProtectedRouter()
  .query("get-logs", {
    input: searchLogchema,
    async resolve({ ctx, input }) {
      const { name, fromDate, toDate } = input;

      if (ctx.session) {
        const logs = await ctx.prisma.userLogs.findMany({
          where: {
            user: {
              OR: [
                { firstName: { contains: name ? name : "" } },
                { lastName: { contains: name ? name : "" } },
              ],
            },
            createAt: {
              gte: fromDate,
              lte: toDate,
            },
            NOT: {
              user: {
                role: Role.PATIENT,
              },
            },
          },
          orderBy: {
            createAt: "desc",
          },
          include: {
            user: true,
          },
        });
        return logs;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  })
  .mutation("time-out", {
    resolve: async ({ ctx }) => {
      const { email } = ctx.session.user;

      if (email) {
        const logout = await ctx.prisma.userLogs.create({
          data: {
            type: "Time Out",
            user: {
              connect: {
                email,
              },
            },
          },
        });
        return logout;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid User",
      });
    },
  });
