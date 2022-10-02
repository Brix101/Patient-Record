import AdminView from "@components/admin/AdminView";
import { trpc } from "@utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";

const RoomPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Rooms</title>
      </Head>
      <AdminView>Room</AdminView>
    </>
  );
};

export default RoomPage;
