import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Clipboard, Columns, Server, User, Users } from "react-feather";
import AccountButton from "../buttons/AccountButton";
import SideBarButton from "../buttons/SideBarButton";
import { RoleCheck } from "../RoleCheck";
import Sidebar from "./Sidebar";

function AdminView({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { pathname } = useRouter();

  const currentUrl = pathname.split("/")[2];

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
          <AccountButton />
        </header>
        <div className="flex h-full ">
          <Sidebar sidebarOpen={sidebarOpen}>
            <div className="mx-4 my-2 space-y-1">
              <SideBarButton href={"/admin"}>
                <Server size={20} />
                <a>Dashboard</a>
              </SideBarButton>
              <SideBarButton href={"/admin/room"}>
                <Columns size={20} />
                <a>Room</a>
              </SideBarButton>
              <SideBarButton href={"/admin/physician"}>
                <User size={20} />
                <a>Physician</a>
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
            <nav className="w-full h-12 flex items-center p-4 text-semibold text-black bg-green-50 drop-shadow-xl">
              <button
                className="p-1 mr-4 hover:bg-green-200 rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="black"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <p className="capitalize">
                {currentUrl ? currentUrl : "Dashboard"}
              </p>
            </nav>

            <main className="mx-10 my-5 h-[80vh] min-h-0 overflow-y-scroll">
              {children}
            </main>
          </div>
        </div>
      </main>
    </RoleCheck>
  );
}

export default AdminView;
