import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { RoleCheck } from "../../components/RoleCheck";

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
