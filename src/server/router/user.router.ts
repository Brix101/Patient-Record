import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import {
  confirmOtpSchema,
  createUserSchema,
  requestOtpSchema,
} from "../../schema/user.schema";
import { decode, encode } from "../../utils/base64";
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

      const otp = await ctx.prisma.otp.create({
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
        hash: encode(`${otp.id}`),
        email: user.email,
      };
      // return await ctx.prisma.example.findMany();
    },
  })
  .mutation("confirm-otp", {
    input: confirmOtpSchema,
    resolve: async ({ ctx, input }) => {
      const { hash, otp, email } = input;

      const decoded = decode(hash);
      const resOtp = await ctx.prisma.otp.findFirst({
        where: {
          id: Number(decoded),
          otp,
          user: {
            email,
          },
        },
      });
      if (!resOtp) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "OTP Not Found",
        });
      }
      if (resOtp.verified === true) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "OTP Already Used",
        });
      }

      if (resOtp.expiration_time < new Date()) {
        throw new trpc.TRPCError({
          code: "TIMEOUT",
          message: "OTP Expired",
        });
      }

      const upOtp = await ctx.prisma.otp.update({
        where: {
          id: Number(decoded),
        },
        data: {
          verified: true,
          expiration_time: new Date(),
        },
        include: {
          user: true,
        },
      });
      // TODO add jwt signin
      return {
        role: upOtp.user.role,
      };
      // return await ctx.prisma.example.findMany();
    },
  });
