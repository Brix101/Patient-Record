import type { NextPage } from "next";
import Head from "next/head";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const PhysicianPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Physician</title>
      </Head>
      <ManagementView>Physician</ManagementView>
    </>
  );
};

export default PhysicianPage;
