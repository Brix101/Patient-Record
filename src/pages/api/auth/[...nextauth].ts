import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { env } from "@env/server.mjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@server/db/client";
import patient from "../patient/[patient]";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      user && (token = { ...user });
      return token;
    },
    async session({ session, token }) {
      session = { expires: session.expires, user: { ...token } };
      return session;
    },
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const _user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
          include: {
            patient: true,
          },
        });

        const userName = _user?.firstName + " " + _user?.lastName;
        const patientName =
          _user?.patient?.firstName + " " + _user?.patient?.lastName;

        const user = {
          id: _user?.id,
          name: _user?.patient ? patientName : userName,
          image: _user?.image,
          role: _user?.role,
          email: _user?.email,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/signin",
  // },
};

export default NextAuth(authOptions);
