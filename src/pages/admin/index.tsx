import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import ManagementView from "../../components/management/ManagementView";
import { useRoleContext } from "../../context/role.context";

const ManagementPage: NextPage = () => {
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
