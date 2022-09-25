import type { NextPage } from "next";
import Head from "next/head";
import ManagementView from "../../components/management/ManagementView";
import { trpc } from "../../utils/trpc";

const RoomPage: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Management - Rooms</title>
      </Head>
      <ManagementView>Room</ManagementView>
    </>
  );
};

export default RoomPage;
