import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRoleContext } from "../context/role.context";

export function RoleCheck({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const role = useRoleContext();
  const view = router.pathname.split("/")[1];

  if (session.status === "unauthenticated") {
    router.push("/signin/signin");
  }
  if (!role) {
    return <div>Verifying....</div>;
  }

  if (session.status === "authenticated") {
    if (role && role !== view) {
      router.push(`/${role}`);
      return <div>Redirecting....</div>;
    }
  }
  return <>{children}</>;
}
