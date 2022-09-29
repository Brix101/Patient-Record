import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";

const AddUser = dynamic(() => import("../../components/admin/AddUser"), {
  ssr: false,
});

const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <AdminView>
        <AddUser />
      </AdminView>
    </>
  );
};

export default UsersPage;
