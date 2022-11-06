import { useAppDispatch } from "@/app/hook";
import Main from "@/components/Layout/Main";
import SuspenseComponent from "@/components/SuspenseComponent";
import {
  setPatientData,
  setPatientsMode,
} from "@/features/patients/patientsSlice";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
const PatientData = dynamic(() => import("@/features/patients/PatientData"), {
  ssr: false,
});

const Patient: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { patient } = router.query;
  const { data, isLoading } = trpc.useQuery([
    "patient.get-patient",
    {
      id: parseInt(patient as unknown as string),
    },
  ]);

  useEffect(() => {
    if (data) {
      dispatch(setPatientData(data));
    }
  }, [data, dispatch]);

  return (
    <Main>
      <SuspenseComponent isLoading={isLoading}>
        <div className="flex-1">
          <PatientData />
        </div>
      </SuspenseComponent>
    </Main>
  );
};

export default Patient;
