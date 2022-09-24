import type { NextPage } from "next";
import Head from "next/head";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const UsersPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <ManagementView>Users</ManagementView>
    </>
  );
};

export default UsersPage;
