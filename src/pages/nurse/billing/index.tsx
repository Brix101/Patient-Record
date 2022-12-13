import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import Head from "next/head";

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - Billing Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="flex-1">Billing</div>
      </Main>
    </>
  );
};

export default NursePage;