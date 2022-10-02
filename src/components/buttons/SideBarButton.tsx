import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function SideBarButton({
  href,
  children,
}: {
  href: string;
  children?: React.ReactNode;
}) {
  const { pathname } = useRouter();
  const active = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`h-12 w-full space-x-2 flex items-center select-none 
        ${
          active
            ? "border-green-100 bg-green-100 text-green-800 font-semibold"
            : "cursor-pointer hover:bg-green-100 hover:border-green-400"
        }`}
      >
        <div className={`h-full w-2 ${active && "bg-green-600"}`}></div>
        <>{children}</>
      </div>
    </Link>
  );
}

export default SideBarButton;
