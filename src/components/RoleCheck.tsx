import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function RoleCheck({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { data, status } = useSession();
  const view = router.pathname.split("/")[1];

  const role = data?.user?.role?.toLowerCase();
  if (status === "unauthenticated") {
    router.push("/signin");
  }

  if (!role) {
    return <div>Verifying....</div>;
  }

  if (status === "authenticated") {
    if (role && role !== view) {
      router.push(`/${role}`);
      return <div>Redirecting....</div>;
    }
  }
  return <>{children}</>;
}
