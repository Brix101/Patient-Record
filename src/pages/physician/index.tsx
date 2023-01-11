import Main from "@/components/Layout/Main";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const PhysicianAppointment = dynamic(
  () => import("@features/appointment/PhysicianAppointment")
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Doctor Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <PhysicianAppointment />
      </Main>
    </>
  );
};

export default Home;
