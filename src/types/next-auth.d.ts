import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string | null;
      role?: Role | null;
    } & DefaultSession["user"];
  }
}

export type Hash = {
  email: string | undefined;
  hash: string | undefined;
};
