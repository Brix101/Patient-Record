import { loginUserchema } from "@/schema/auth.schema";
import { comparePassword } from "@/utils/bcryptHash";
import { createRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const authRouter = createRouter().mutation("login-user", {
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
});
