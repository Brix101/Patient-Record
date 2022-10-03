import ProfileButton from "@components/buttons/ProfileButton";
import { RoleCheck } from "@components/RoleCheck";
import Link from "next/link";
import React from "react";

function Nurse({ children }: { children?: React.ReactNode }) {
  return (
    <RoleCheck>
      <main className="overflow-hidden h-screen">
        <header className="w-full flex justify-between px-10 items-center p-2  text-semibold text-black bg-green-50 border-green-500 border-b">
          <Link href="/">
            <div className="flex flex-col self-center text-center cursor-pointer select-none hover:bg-gray-50 hover:text-gray-800">
              <h1 className="text-lg">Medidas Medical Center</h1>
              <h3 className="text-xs">Valencia City, Bukidnon</h3>
            </div>
          </Link>
          <ProfileButton />
        </header>
        <div className="flex h-full ">
          <div className="flex-1">
            <main className="mx-10 my-5 h-[85vh] min-h-0 overflow-y-scroll">
              {children}
            </main>
          </div>
        </div>
      </main>
    </RoleCheck>
  );
}

export default Nurse;
