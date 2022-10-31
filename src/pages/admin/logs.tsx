import Admin from "@/components/Layout/Admin";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const ViewLogs = dynamic(() => import("@features/logs/VeiwLogs"), {
  ssr: true,
});
const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Management - Logs</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        <ViewLogs />
      </Admin>
    </>
  );
};

export default UsersPage;
