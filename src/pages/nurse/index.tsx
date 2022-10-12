import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import Main from "@/components/Layout/Main";
import LinearLoading from "@/components/LinearLoading";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { PlusSquare } from "react-feather";

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - Patient List</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <main className="h-auto w-full px-2">
          <div className="h-14 w-full flex justify-between items-center  px-5">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            </div>
            <div className="flex flex-row gap-5">
              <div>
                <SearchInput placeholder="Search a Name" />
              </div>
              <Link href="/nurse/newpatient">
                <SecondaryButton className="w-11">
                  <PlusSquare size={24} />
                </SecondaryButton>
              </Link>
            </div>
          </div>
          <div className="w-full h-[200vh] p-2 shadow-xl">
            <LinearLoading isLoading={true} />
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Patient Name
                  </th>
                  <th scope="col" className="py-3 px-3">
                    gender
                  </th>
                  <th scope="col" className="py-3 px-8">
                    Birthday
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Address
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Contact No.
                  </th>
                  <th scope="col" className="py-3 px-2">
                    Blood type
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </main>
      </Main>
    </>
  );
};

export default NursePage;
