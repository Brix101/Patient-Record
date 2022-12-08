import Admin from "@/components/Layout/Admin";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import { Suspense } from "react";

const ManagementPage: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["dashboard.analytics"]);

  return (
    <>
      <Head>
        <title>Management</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        <Suspense>
          <div className="w-full h-full flex items-center flex-col gap-10">
            {!isLoading ? (
              <div className="h-fit  flex justify-center flex-wrap gap-10">
                <div className="h-28 select-none bg-green-100 border-2 drop-shadow-lg shadow-lg w-52 rounded-xl flex flex-col items-center justify-start px-5 py-2">
                  <p className="capitalize select-none w-full text-base font-bold text-gray-700">
                    total patients
                  </p>
                  <h1 className="text-5xl font-bold">{data?.patients}</h1>
                </div>
                {data?.medicalRecord.map(({ status, _count }, index) => (
                  <div
                    className="h-28 select-none bg-green-100 border-2 drop-shadow-lg shadow-lg w-52 rounded-xl flex flex-col items-center justify-start px-5 py-2"
                    key={index}
                  >
                    <p className="capitalize select-none w-full text-base font-bold text-gray-700">
                      {status}
                    </p>
                    <h1 className="text-5xl font-bold">{_count._all}</h1>
                  </div>
                ))}
              </div>
            ) : null}
            {/* <div className="h-fit max-w-3xl flex justify-center flex-wrap gap-10">
              <div className="h-28 select-none bg-green-100 border-2 drop-shadow-lg shadow-lg w-52 rounded-xl flex flex-col items-center justify-start px-5 py-2">
                <p className="capitalize select-none w-full text-base font-bold text-gray-700">
                  total users
                </p>
                <h1 className="text-5xl font-bold">{data?.users}</h1>
              </div>
              {data?.userRole.map(({ role, _count }, index) => (
                <div
                  className="h-28 select-none bg-green-100 border-2 drop-shadow-lg shadow-lg w-52 rounded-xl flex flex-col items-center justify-start px-5 py-2"
                  key={index}
                >
                  <p className="capitalize select-none w-full text-base font-bold text-gray-700">
                    {role}
                  </p>
                  <h1 className="text-5xl font-bold">{_count._all}</h1>
                </div>
              ))}
            </div> */}
          </div>
        </Suspense>
      </Admin>
    </>
  );
};

export default ManagementPage;
