import { useAppSelector } from "@/app/hook";
import Main from "@/components/Layout/Main";
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

const NursePage: NextPage = () => {
  const { mode } = useAppSelector(medicinesState);
  return (
    <>
      <Head>
        <title>Pharmacist Page</title>
      </Head>
      <Main>
        <div className="container">
          {mode === "View" && <ViewMedicine />}
          {mode === "Add" && <AddMedicine />}
          {mode === "Edit" && <EditMedicine />}
        </div>
      </Main>
    </>
  );
};

export default NursePage;
