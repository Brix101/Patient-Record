import { loginUserchema } from "@/schema/auth.schema";
import { registerPatientUserSchema } from "@/schema/patient.schema";
import { comparePassword, hashPassword } from "@/utils/bcryptHash";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const authRouter = createRouter()
  .mutation("login-user", {
    input: loginUserchema,
    resolve: async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }
      const passwordCorrect = comparePassword({
        candidatePassword: password,
        hashedPassword: user.password ? user.password : "",
      });

      if (!passwordCorrect) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Incorrect Password",
        });
      }
      await ctx.prisma.userLogs.create({
        data: {
          type: "Time In",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return {
        email: user.email,
        role: user.role,
      };
    },
  })
  .mutation("register-account", {
    input: registerPatientUserSchema,
    resolve: async ({ input, ctx }) => {
      const { email, password, patiendId } = input;

      try {
        const isPatienRegistered = await ctx.prisma.user.findFirst({
          where: {
            patient: {
              id: parseInt(patiendId),
            },
          },
        });

        if (isPatienRegistered) {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Patient Id already registered",
          });
        }

        if (!isPatienRegistered) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "Patient Id not found",
          });
        }

        const user = await ctx.prisma.user.create({
          data: {
            email,
            password: await hashPassword({ password }),
            role: Role.PATIENT,
            patient: {
              connect: {
                id: parseInt(patiendId),
              },
            },
          },
        });

        return {
          email: user.email,
          role: user.role,
        };
      } catch (e) {
        // console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        const error = e as unknown as trpc.TRPCError;

        throw new trpc.TRPCError(error);
      }
    },
  });
