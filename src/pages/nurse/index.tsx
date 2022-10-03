import Nurse from "@/components/Layout/Nurse";
import type { NextPage } from "next";
import Head from "next/head";

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse Page</title>
      </Head>
      <Nurse>
        <main>
          <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            Nurse
          </div>
        </main>
      </Nurse>
    </>
  );
};

export default NursePage;
