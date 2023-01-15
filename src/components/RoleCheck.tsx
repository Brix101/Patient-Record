import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function RoleCheck({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { data, status } = useSession();
  const view = router.pathname.split("/")[1];

  const unPro = ["/", "/signin", "/register"];

  const role = data?.user?.role?.toLowerCase();

  if (status === "unauthenticated") {
    if (!unPro.includes(router.pathname)) {
      router.push("/signin");
    }
  } else {
    if (!role) {
      return <div>Verifying....</div>;
    }

    if (status === "authenticated") {
      if (role && role !== view) {
        router.push(`/${role}`);
        return <div>Redirecting....</div>;
      }
    }
  }
  return <>{children}</>;
}
