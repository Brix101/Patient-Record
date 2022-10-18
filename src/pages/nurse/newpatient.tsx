import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const AddPatient = dynamic(() => import("@features/patients/NewPatient"), {
  ssr: false,
});

const NewPatient: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - New Patient</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <AddPatient />
      </Main>
    </>
  );
};

export default NewPatient;
