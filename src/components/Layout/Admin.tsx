import UpdateUser from "@/features/user/UpdateUser";
import ProfileButton from "@components/buttons/ProfileButton";
import SideBarButton from "@components/buttons/SideBarButton";
import { RoleCheck } from "@components/RoleCheck";
import Sidebar from "@features/sideBar/Sidebar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { Clipboard, Package, Server, Sliders, Users } from "react-feather";

function Admin({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
        />
      </Head>
      <RoleCheck>
        <Suspense>
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
                    <Sliders size={20} />
                    <a>Dashboard</a>
                  </SideBarButton>
                  <SideBarButton href={"/admin/patient"}>
                    <Clipboard size={20} />
                    <a>Patient</a>
                  </SideBarButton>
                  <SideBarButton href={"/admin/medicine"}>
                    <Package size={20} />
                    <a>Medicines</a>
                  </SideBarButton>
                  <SideBarButton href={"/admin/users"}>
                    <Users size={20} />
                    <a>Users</a>
                  </SideBarButton>
                  <SideBarButton href={"/admin/logs"}>
                    <Server size={20} />
                    <a>Logs</a>
                  </SideBarButton>
                </div>
              </Sidebar>
              <div className="flex-1">
                <div className="mx-10 my-5 h-[85vh] min-h-0 overflow-y-scroll">
                  {children}
                </div>
              </div>
            </div>
            <div>
              <UpdateUser />
            </div>
          </main>
        </Suspense>
      </RoleCheck>
    </>
  );
}

export default Admin;
