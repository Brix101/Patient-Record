import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const ManagementPage: NextPage = () => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management</title>
      </Head>
      <ManagementView>Dashboard</ManagementView>
    </>
  );
};

export default ManagementPage;
