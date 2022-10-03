import Admin from "@/components/Layout/Admin";
import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";

const PatientPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Patient</title>
      </Head>
      <Admin>Patient</Admin>
    </>
  );
};

export default PatientPage;
