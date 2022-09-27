import type { NextPage } from "next";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";
import { trpc } from "../../utils/trpc";

const PatientPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Patient</title>
      </Head>
      <AdminView>Patient</AdminView>
    </>
  );
};

export default PatientPage;
