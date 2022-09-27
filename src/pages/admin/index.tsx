import type { NextPage } from "next";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";

const ManagementPage: NextPage = () => {
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
