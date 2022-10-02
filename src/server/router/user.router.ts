import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createUserSchema, searchUserSchema } from "@schema/user.schema";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const usersRouter = createProtectedRouter()
  .mutation("register-user", {
    input: createUserSchema,
    resolve: async ({ input, ctx }) => {
      const {
        email,
        firstName,
        lastName,
        role,
        image,
        gender,
        address,
        birthday,
        mobile,
        expertes,
        licenseNUmber,
      } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            role: Role[role as keyof typeof Role],
            image,
            gender,
            address,
            birthday,
            mobile,
          },
        });

        if (role === Role.PHYSICIAN) {
          await ctx.prisma.physician.create({
            data: {
              expertes,
              licenseNUmber,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("all-users", {
    input: searchUserSchema,
    async resolve({ ctx, input }) {
      const { name } = input;
      if (ctx.session) {
        const email = ctx.session.user?.email;

        if (email) {
          const user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (user?.role === Role.ADMIN && input) {
            const users = await ctx.prisma.user.findMany({
              where: {
                OR: [
                  { firstName: { contains: name ? name : "" } },
                  { lastName: { contains: name ? name : "" } },
                ],
              },
              orderBy: {
                lastName: "asc",
              },
              include: {
                Physician: true,
              },
            });
            return users;
          }
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "Only Administrator Can view this data",
          });
        }
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Please Login",
        });
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid User",
      });
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      if (ctx.session) {
        const email = ctx.session.user?.email;

        if (email) {
          const userData = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          });

          return userData;
        }
      }
      return null;
    },
  });
