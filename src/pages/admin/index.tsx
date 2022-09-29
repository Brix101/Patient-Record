import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";

const ManagementPage: NextPage = () => {
  const { data } = useSession();

  console.log(data?.user?.id);
  return (
    <>
      <Head>
        <title>Management</title>
      </Head>
      <AdminView>Dashboard</AdminView>
    </>
  );
};

export default ManagementPage;
