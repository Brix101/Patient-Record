import { useAppSelector } from "@/app/hook";
import Admin from "@/components/Layout/Admin";
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

const PatientData = dynamic(() => import("@/features/patients/PatientData"), {
  ssr: false,
});

const PatientPage: NextPage = () => {
  const { mode } = useAppSelector(patientsState);
  return (
    <>
      <Head>
        <title>Management - Patient</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        {mode === "View" && <ViewPatient />}
        {mode === "Add" && <NewPatient />}
        {mode === "Edit" && <PatientData />}
      </Admin>
    </>
  );
};

export default PatientPage;
