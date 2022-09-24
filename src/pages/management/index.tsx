import type { NextPage } from "next";
import Head from "next/head";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const ManagementPage: NextPage = () => {
  const { data, isLoading, error } = trpc.useQuery(["auth.getSession"]);

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
