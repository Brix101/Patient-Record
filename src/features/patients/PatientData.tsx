import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SuspenseComponent from "@/components/SuspenseComponent";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Edit, FileText, Trash2, X } from "react-feather";
import PatientForm from "./PatientForm";
import PatientRecord from "./PatientRecord";
import {
  patientsState,
  setPatientsMode,
  togglePatientAdmit,
  togglePatientEditMode,
} from "./patientsSlice";

const PatientData: NextPage = () => {
  const dispatch = useAppDispatch();
  const { data: sessionData } = useSession();
  const [isActive, setIsActive] = useState<boolean>(false);
  const { patient, isEditPatient, isAdmitPatient } =
    useAppSelector(patientsState);

  const { mutate: deleteMutation } = trpc.useMutation(
    ["patient.delete-patient"],
    {
      onMutate: () => {
        setIsActive(true);
      },
      onSuccess: () => {
        dispatch(setPatientsMode({ mode: "View" }));
        setIsActive(false);
      },
    }
  );

  const deleteDialog = () => {
    if (window.confirm("Are you sure to Delete this Patient Data?")) {
      deleteMutation({ id: patient?.id as number });
    }
  };

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen mb-20">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmitPatient && "Admit Patient"}
            {isEditPatient && "Update Patient Information"}
            {!isAdmitPatient && !isEditPatient && "Patient Information"}
          </h1>
        </div>
        <div className="flex flex-row gap-5">
          <SuspenseComponent isLoading={isActive}>
            {sessionData?.user?.role === "ADMIN" ? (
              <OutlinedButton
                className="w-11"
                tooltip="Delete Patient"
                onClick={deleteDialog}
              >
                <Trash2 className="group-hover:text-red-600" size={24} />
              </OutlinedButton>
            ) : null}
            <PrimaryButton
              className="w-11"
              tooltip={isEditPatient ? "Cancel Update" : "Update Patient"}
              onClick={() => dispatch(togglePatientEditMode())}
            >
              {isEditPatient ? <X size={24} /> : <Edit size={24} />}
            </PrimaryButton>
            <SecondaryButton
              className="w-11"
              tooltip={isAdmitPatient ? "Cancel Admit" : "Admit Patient"}
              onClick={() => dispatch(togglePatientAdmit())}
            >
              {isAdmitPatient ? <X size={24} /> : <FileText size={24} />}
            </SecondaryButton>
          </SuspenseComponent>
        </div>
      </div>
      <PatientForm />
      <PatientRecord />
    </div>
  );
};

export default PatientData;
