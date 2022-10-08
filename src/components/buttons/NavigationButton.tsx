import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function NavigationButton({
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
        className={`block cursor-pointer py-2 pr-4 pl-3
        ${
          active
            ? "text-white bg-green-700 rounded md:bg-transparent md:text-green-700 md:p-0 dark:text-white"
            : " text-grey-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent"
        }`}
      >
        <>{children}</>
      </div>
    </Link>
  );
}

export default NavigationButton;
