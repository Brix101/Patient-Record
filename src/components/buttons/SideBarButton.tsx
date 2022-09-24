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

  return (
    <Link href={href}>
      <div
        className={`h-12 w-full rounded-lg px-4 space-x-2 flex items-center border select-none 
        ${
          pathname === href
            ? "border-green-100 bg-gray-100"
            : "cursor-pointer hover:bg-green-700 hover:border-green-400 hover:text-white"
        }`}
      >
        <>{children}</>
      </div>
    </Link>
  );
}

export default SideBarButton;
