import { RoleCheck } from "@components/RoleCheck";
import type { NextPage } from "next";
import Head from "next/head";

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse Page</title>
      </Head>
      <RoleCheck>
        <main>
          <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            Nurse
          </div>
        </main>
      </RoleCheck>
    </>
  );
};

export default NursePage;
