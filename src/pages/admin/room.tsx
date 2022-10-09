import { useAppSelector } from "@/app/hook";
import Admin from "@/components/Layout/Admin";
import { roomsState } from "@/features/rooms/roomsSlice";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const AddRoom = dynamic(() => import("@features/rooms/AddRoom"), {
  ssr: false,
});
const EditRoom = dynamic(() => import("@features/rooms/EditRoom"), {
  ssr: false,
});
const ViewRoom = dynamic(() => import("@features/rooms/ViewRoom"), {
  ssr: false,
});

const RoomPage: NextPage = () => {
  const { mode } = useAppSelector(roomsState);
  return (
    <>
      <Head>
        <title>Management - Rooms</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        {mode === "View" && <ViewRoom />}
        {mode === "Add" && <AddRoom />}
        {mode === "Edit" && <EditRoom />}
      </Admin>
    </>
  );
};

export default RoomPage;
