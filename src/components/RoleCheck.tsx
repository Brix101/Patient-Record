import { useRoleContext } from "@context/role.context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function RoleCheck({
  children,
  check = true,
}: {
  children?: React.ReactNode;
  check?: boolean;
}) {
  const router = useRouter();
  const session = useSession();
  const role = useRoleContext();
  const view = router.pathname.split("/")[1];

  if (check) {
    if (session.status === "unauthenticated") {
      router.push("/signin");
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
  }
  return <>{children}</>;
}
