import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SuspenseComponent from "@/components/SuspenseComponent";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Edit, FilePlus, Trash2 } from "react-feather";
import AdmitForm from "./AdmitForm";
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
  const { patient, isEditPatient, isAddPatientRecord } =
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
    <>
      <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden pb-20">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-400">
              {isAddPatientRecord && "Add Patient Record"}
              {isEditPatient && "Update Patient Information"}
              {!isAddPatientRecord && !isEditPatient && "Patient Information"}
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
              {!isEditPatient && !isAddPatientRecord && (
                <>
                  <PrimaryButton
                    className="w-11"
                    tooltip="Update Patient"
                    onClick={() => dispatch(togglePatientEditMode())}
                  >
                    <Edit size={24} />
                  </PrimaryButton>
                  {patient?.isAdmitted ? (
                    <SecondaryButton
                      className="w-11"
                      tooltip="Admit Patient"
                      onClick={() => dispatch(togglePatientAdmit())}
                    >
                      <FilePlus size={24} />
                    </SecondaryButton>
                  ) : null}
                </>
              )}
            </SuspenseComponent>
          </div>
        </div>
        {isAddPatientRecord ? <AdmitForm /> : <PatientForm />}
      </div>
      {!isEditPatient && !isAddPatientRecord ? (
        <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen mb-20">
          <PatientRecord />
        </div>
      ) : null}
    </>
  );
};

export default PatientData;
