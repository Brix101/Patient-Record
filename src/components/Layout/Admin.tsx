import ProfileButton from "@components/buttons/ProfileButton";
import SideBarButton from "@components/buttons/SideBarButton";
import { RoleCheck } from "@components/RoleCheck";
import Sidebar from "@features/sideBar/Sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Clipboard, Columns, Server, Users } from "react-feather";

function Admin({ children }: { children?: React.ReactNode }) {
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
          <ProfileButton />
        </header>
        <div className="flex h-full ">
          <Sidebar>
            <div className="my-2 space-y-1">
              <SideBarButton href={"/admin"}>
                <Server size={20} />
                <a>Dashboard</a>
              </SideBarButton>
              <SideBarButton href={"/admin/room"}>
                <Columns size={20} />
                <a>Room</a>
              </SideBarButton>
              <SideBarButton href={"/admin/patient"}>
                <Clipboard size={20} />
                <a>Patient</a>
              </SideBarButton>
              <SideBarButton href={"/admin/users"}>
                <Users size={20} />
                <a>Users</a>
              </SideBarButton>
            </div>
          </Sidebar>
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

export default Admin;
