import UpdateUser from "@/features/user/UpdateUser";
import ProfileButton from "@components/buttons/ProfileButton";
import { RoleCheck } from "@components/RoleCheck";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavigationButton from "../buttons/NavigationButton";

function Main({ children }: { children?: React.ReactNode }) {
  const { data } = useSession();

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
        />
      </Head>
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
                  {data && data.user?.role === Role.PHARMACIST && (
                    <>
                      <li>
                        <NavigationButton href="/pharmacist">
                          Medicines
                        </NavigationButton>
                      </li>
                      <li>
                        <NavigationButton href="/pharmacist/requests">
                          Requests
                        </NavigationButton>
                      </li>
                    </>
                  )}
                  {data && data.user?.role === Role.NURSE && (
                    <>
                      <li>
                        <NavigationButton href="/nurse">
                          Patients
                        </NavigationButton>
                      </li>
                      <li>
                        <NavigationButton href="/nurse/appointment">
                          Appointments
                        </NavigationButton>
                      </li>
                      <li>
                        <NavigationButton href="/nurse/room">
                          Rooms
                        </NavigationButton>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <ProfileButton />
            </div>
          </header>
          <div className="flex-1">
            <div className="mx-10 my-2 flex justify-center h-[85vh] min-h-0 overflow-y-scroll">
              {children}
            </div>
          </div>
          <UpdateUser />
        </main>
      </RoleCheck>
    </>
  );
}

export default Main;
