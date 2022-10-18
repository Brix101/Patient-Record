import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const ViewPatient = dynamic(() => import("@features/patients/ViewPatient"), {
  ssr: false,
});

const NursePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - Patient List</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <ViewPatient />
      </Main>
    </>
  );
};

export default NursePage;
