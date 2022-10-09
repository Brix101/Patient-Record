import { useAppSelector } from "@/app/hook";
import Admin from "@/components/Layout/Admin";
import { medicinesState } from "@/features/medicines/medicinesSlice";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const AddMedicine = dynamic(() => import("@features/medicines/AddMedicine"), {
  ssr: false,
});
const EditMedicine = dynamic(() => import("@features/medicines/EditMedicine"), {
  ssr: false,
});
const ViewMedicine = dynamic(() => import("@features/medicines/ViewMedicine"), {
  ssr: false,
});

const RoomPage: NextPage = () => {
  const { mode } = useAppSelector(medicinesState);
  return (
    <>
      <Head>
        <title>Management - Rooms</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        {mode === "View" && <ViewMedicine />}
        {mode === "Add" && <AddMedicine />}
        {mode === "Edit" && <EditMedicine />}
      </Admin>
    </>
  );
};

export default RoomPage;
