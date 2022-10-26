import Main from "@/components/Layout/Main";
import TestCalendar from "@/components/TestCalendar";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const NewPatient: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - New Patient</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <TestCalendar />
      </Main>
    </>
  );
};

export default NewPatient;
