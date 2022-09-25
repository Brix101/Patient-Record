import type { NextPage } from "next";
import Head from "next/head";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const PatientPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Patient</title>
      </Head>
      <ManagementView>Patient</ManagementView>
    </>
  );
};

export default PatientPage;
