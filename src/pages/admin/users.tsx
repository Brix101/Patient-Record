import AdminView from "@components/admin/AdminView";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

const AddUser = dynamic(() => import("@components/admin/user/AddUser"), {
  ssr: false,
});
const Users = dynamic(() => import("@components/admin/user/Users"), {
  ssr: false,
});

const UsersPage: NextPage = () => {
  const [addMode, setAddMode] = useState(false);
  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <AdminView>
        {addMode ? (
          <AddUser addMode={addMode} setAddMode={setAddMode} />
        ) : (
          <Users addMode={addMode} setAddMode={setAddMode} />
        )}
      </AdminView>
    </>
  );
};

export default UsersPage;
