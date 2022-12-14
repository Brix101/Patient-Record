import { useAppSelector } from "@/app/hook";
import Main from "@/components/Layout/Main";
import { patientsState } from "@/features/patients/patientsSlice";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const ViewPatient = dynamic(() => import("@features/patients/ViewPatient"), {
  ssr: true,
});

const NewPatient = dynamic(() => import("@features/patients/NewPatient"), {
  ssr: false,
});

const NursePage: NextPage = () => {
  const { mode } = useAppSelector(patientsState);
  return (
    <>
      <Head>
        <title>Nurse - Patient List</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="flex-1">
          {mode === "View" && <ViewPatient />}
          {mode === "Add" && <NewPatient />}
        </div>
      </Main>
    </>
  );
};

export default NursePage;
