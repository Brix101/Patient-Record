import Admin from "@/components/Layout/Admin";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

const ManagementPage: NextPage = () => {
  const session = useSession();

  console.log(session.data);
  return (
    <>
      <Head>
        <title>Management</title>
      </Head>
      <Admin>Dashboard</Admin>
    </>
  );
};

export default ManagementPage;
