import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import Head from "next/head";

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pharmacist Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <main>
          <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            Pharmacist
          </div>
        </main>
      </Main>
    </>
  );
};

export default NursePage;
