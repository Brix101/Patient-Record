import { useAppSelector } from "@/app/hook";
import Admin from "@/components/Layout/Admin";
import { usersState } from "@/features/users/usersSlice";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const AddUser = dynamic(() => import("@features/users/AddUser"), {
  ssr: false,
});
const ViewUsers = dynamic(() => import("@features/users/ViewUsers"), {
  ssr: true,
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
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        {mode === "View" && <ViewUsers />}
        {mode === "Add" && <AddUser />}
        {mode === "Edit" && <EditUser />}
      </Admin>
    </>
  );
};

export default UsersPage;
