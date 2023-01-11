import { searchPhysicianSchema } from "@/schema/physician.schema";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const physiciansRouter = createProtectedRouter()
  .query("all-physicians", {
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
            Appointment: true,
          },
        });
        return physicians;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  })
  .query("get-physician", {
    async resolve({ ctx }) {
      if (ctx.session) {
        const email = ctx.session.user?.email;
        const role = ctx.session.user?.role;

        if (email && role === "PHYSICIAN") {
          const userData = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
            include: {
              Physician: {
                include: {
                  Appointment: {
                    include: {
                      MedicalRecord: {
                        include: {
                          room: true,
                          patient: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          return userData;
        }
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  });
