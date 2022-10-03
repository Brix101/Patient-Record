import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUserSchema,
  deleteUserSchema,
  searchUserSchema,
  updateUserSchema,
} from "@schema/user.schema";
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
        expertise,
        licenseNumber,
      } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            role,
            image,
            gender,
            address,
            birthday,
            mobile,
            Physician:
              role === "PHYSICIAN"
                ? {
                    create: {
                      expertise,
                      licenseNumber,
                    },
                  }
                : undefined,
          },
        });

        return user;
      } catch (e) {
        console.log(e);
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
  })
  .mutation("update-user", {
    input: updateUserSchema,
    resolve: async ({ input, ctx }) => {
      const {
        id,
        email,
        firstName,
        lastName,
        role,
        image,
        gender,
        address,
        birthday,
        mobile,
        expertise,
        licenseNumber,
      } = input;

      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            email,
            firstName,
            lastName,
            role,
            image,
            gender,
            address,
            birthday,
            mobile,
            Physician:
              role === "PHYSICIAN"
                ? {
                    update: {
                      expertise,
                      licenseNumber,
                    },
                  }
                : undefined,
          },
          include: {
            Physician: true,
          },
        });
        return user;
      } catch (e) {
        // if (e instanceof PrismaClientKnownRequestError) {
        //   if (e.code === "P2002") {
        //     throw new trpc.TRPCError({
        //       code: "CONFLICT",
        //       message: "User already exists",
        //     });
        //   }
        // }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-user", {
    input: deleteUserSchema,
    resolve: async ({ ctx, input }) => {
      const { role } = ctx.session.user;

      if (role === Role.ADMIN) {
        const deletedUser = await ctx.prisma.user.delete({
          where: {
            id: input.id,
          },
        });
        return { detail: "User Deleted", deletedUser };
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid User",
      });
    },
  });
