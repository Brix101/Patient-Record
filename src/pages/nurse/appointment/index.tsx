import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const PhysicianAppointment = dynamic(
  () => import("@features/appointment/PhysicianAppointment")
);

const Apointment: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nurse - Apointment</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <PhysicianAppointment />
      </Main>
    </>
  );
};

export default Apointment;
