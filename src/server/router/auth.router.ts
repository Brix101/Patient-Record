import { confirmOtpSchema, requestOtpSchema } from "@/schema/auth.schema";
import { createRouter } from "@server/router/context";
import * as trpc from "@trpc/server";
import { decode, encode } from "@utils/base64";
import { generateOtp } from "@utils/otp";

export const authRouter = createRouter()
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
      const { otp, expiration_time } = generateOtp();
      const savedOtp = await ctx.prisma.otp.create({
        data: {
          otp,
          expiration_time,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return {
        hash: encode(`${savedOtp.id}`),
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
          verified: false,
          expiration_time: {
            gte: new Date(),
          },
        },
      });

      if (!resOtp) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid OTP",
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

      return {
        email: upOtp.user.email,
        role: upOtp.user.role,
      };
    },
  });
