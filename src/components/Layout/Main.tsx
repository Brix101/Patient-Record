import ProfileButton from "@components/buttons/ProfileButton";
import { RoleCheck } from "@components/RoleCheck";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import NavigationButton from "../buttons/NavigationButton";

function Main({ children }: { children?: React.ReactNode }) {
  const { data, status } = useSession();

  const roleRoutes: React.ReactNode[] = [];

  useEffect(() => {
    if (status === "authenticated") {
      if (data.user?.role === Role.PHARMACIST) {
        roleRoutes.push(
          <>
            <li>
              <NavigationButton href="/pharmacist">Medicines</NavigationButton>
            </li>
            <li>
              <NavigationButton href="/pharmacist/requests">
                Requests
              </NavigationButton>
            </li>
          </>
        );
      }
    }
  });

  return (
    <RoleCheck>
      <main className="overflow-hidden h-screen">
        <header className="w-full flex justify-between px-10 items-center p-2  text-semibold text-black bg-green-50 border-green-500 border-b">
          <Link href="/">
            <div className="flex gap-5 cursor-pointer select-none hover:bg-gray-50 hover:text-gray-800">
              <Image
                width={70}
                height={70}
                className="mr-5"
                src="/logo.svg"
                alt="logo"
              />
              <div className="flex flex-col self-center text-center ">
                <h1 className="text-lg">Medidas Medical Center</h1>
                <h3 className="text-xs">Valencia City, Bukidnon</h3>
              </div>
            </div>
          </Link>
          <div className="flex gap-10 items-center">
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="flex flex-row gap-5">
                {/* TODO update user role routes */}
                {roleRoutes && roleRoutes}
              </ul>
            </div>
            <ProfileButton />
          </div>
        </header>
        <div className="flex h-full ">
          <div className="flex-1">
            <main className="mx-10 my-5 flex justify-center h-[85vh] min-h-0 overflow-y-scroll">
              {children}
            </main>
          </div>
        </div>
      </main>
    </RoleCheck>
  );
}

export default Main;
