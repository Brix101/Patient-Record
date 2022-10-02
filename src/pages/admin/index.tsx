import AdminView from "@components/admin/AdminView";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

const ManagementPage: NextPage = () => {
  const session = useSession();

  // console.log(session.data);
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
