import { useAppSelector } from "@/app/hook";
import { usersState } from "@/features/users/usersSlice";
import AdminView from "@components/admin/AdminView";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const AddUser = dynamic(() => import("@features/users/AddUser"), {
  ssr: false,
});
const ViewUsers = dynamic(() => import("@features/users/ViewUsers"), {
  ssr: false,
});
const EditUser = dynamic(() => import("@features/users/EditUser"), {
  ssr: false,
});

const UsersPage: NextPage = () => {
  const { mode } = useAppSelector(usersState);
  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <AdminView>
        {mode === "View" && <ViewUsers />}
        {mode === "Add" && <AddUser />}
        {mode === "Edit" && <EditUser />}
      </AdminView>
    </>
  );
};

export default UsersPage;
