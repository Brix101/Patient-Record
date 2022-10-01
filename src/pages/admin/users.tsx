import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import AdminView from "../../components/admin/AdminView";

const AddUser = dynamic(() => import("../../components/admin/AddUser"), {
  ssr: false,
});
const Users = dynamic(() => import("../../components/admin/Users"), {
  ssr: false,
});

const UsersPage: NextPage = () => {
  const [addUser, setAddUser] = useState(false);
  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <AdminView>
        {addUser ? (
          <AddUser addUser={addUser} setAddUser={setAddUser} />
        ) : (
          <Users addUser={addUser} setAddUser={setAddUser} />
        )}
      </AdminView>
    </>
  );
};

export default UsersPage;
