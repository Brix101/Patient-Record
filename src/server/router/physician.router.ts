import { searchPhysicianSchema } from "@/schema/physician.schema";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const physiciansRouter = createProtectedRouter().query(
  "all-physicians",
  {
    input: searchPhysicianSchema,
    async resolve({ ctx, input }) {
      const { name } = input;
      if (ctx.session) {
        const physicians = await ctx.prisma.physician.findMany({
          where: {
            user: {
              OR: [
                { firstName: { contains: name ? name : "" } },
                { lastName: { contains: name ? name : "" } },
              ],
            },
          },
          include: {
            user: true,
          },
        });
        return physicians;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  }
);
