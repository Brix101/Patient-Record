import type { NextPage } from "next";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";
import { trpc } from "../../utils/trpc";

const PhysicianPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Physician</title>
      </Head>
      <AdminView>Physician</AdminView>
    </>
  );
};

export default PhysicianPage;
