import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { createUserSchema, requestOtpSchema } from "../../schema/user.schema";
import { generateOtp } from "../../utils/otp";
import { createRouter } from "./context";

export const usersRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    resolve: async ({ input, ctx }) => {
      const { email, name, role, image } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
            role: Role[role as keyof typeof Role],
            image,
          },
        });

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
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    resolve: async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          ...input,
        },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }

      await ctx.prisma.otp.create({
        data: {
          ...generateOtp(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return {
        detail: "OTP sent",
      };
      // return await ctx.prisma.example.findMany();
    },
  });
