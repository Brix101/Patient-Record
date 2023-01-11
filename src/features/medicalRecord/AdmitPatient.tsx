import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import SuspenseComponent from "@/components/SuspenseComponent";
import { UpdatePatientInput } from "@/schema/patient.schema";
import { trpc } from "@/utils/trpc";
import { CivilStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Trash2 } from "react-feather";
import { useForm } from "react-hook-form";
import { patientsState, setPatientsMode } from "../patients/patientsSlice";

const AdmitPatient: NextPage = () => {
  const dispatch = useAppDispatch();
  const { data: sessionData } = useSession();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { patient } = useAppSelector(patientsState);

  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { isDirty },
  } = useForm<UpdatePatientInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    "patient.update-patient",
    {
      onSuccess: () => {
        clearErrors();
        setEditMode(false);
      },
    }
  );

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

  useEffect(() => {
    if (patient) {
      reset({
        id: patient.id,
        firstName: patient.firstName as string,
        middleName: patient.middleName as string,
        lastName: patient.lastName as string,
        gender: patient.gender as string,
        birthday: patient.birthday as Date,
        civilStatus: patient.civilStatus as CivilStatus,
        mobile: patient.mobile as string,
        religion: patient.religion as string,
        nationality: patient.nationality as string,
        address: patient.address as string,
        bloodType: patient.bloodType as string,
      });
    }
  }, [patient, reset]);

  const genderOptions = [
    { label: "male", value: "MALE" },
    { label: "female", value: "FEMALE" },
  ];

  const bloodType = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];

  const civilStatus = (
    Object.keys(CivilStatus) as (keyof typeof CivilStatus)[]
  ).map((enumKey) => {
    return {
      label: CivilStatus[enumKey].toLowerCase(),
      value: CivilStatus[enumKey],
    };
  });

  function onSubmit(values: UpdatePatientInput) {
    mutate({ ...values });
  }

  const deleteDialog = () => {
    if (window.confirm("Are you sure to Delete this Patient Data?")) {
      deleteMutation({ id: patient?.id as number });
    }
  };

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admit Patient</h1>
        </div>
        <div className="flex flex-row gap-5">
          <SuspenseComponent isLoading={isActive}>
            <SecondaryButton
              className="w-11"
              tooltip="View Patients"
              onClick={() => dispatch(setPatientsMode({ mode: "View" }))}
            >
              <ArrowLeft size={24} />
            </SecondaryButton>
            <PrimaryButton
              className="w-11"
              tooltip="Update Patient"
              onClick={() => setEditMode(true)}
            >
              <Edit size={24} />
            </PrimaryButton>
            {sessionData?.user?.role === "ADMIN" ? (
              <OutlinedButton
                className="w-11"
                tooltip="Delete Patient"
                onClick={deleteDialog}
              >
                <Trash2 className="group-hover:text-red-600" size={24} />
              </OutlinedButton>
            ) : null}
          </SuspenseComponent>
        </div>
      </div>
      {error && (
        <div
          className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Error alert! </span>
          {error && error.message}
        </div>
      )}
      {isSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Patient Data
          Updated
        </div>
      )}
      <div className="relative w-full h-auto p-2 flex justify-center overflow-hidden">
        <form
          className="max-w-9xl py-5 mb-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <div className="col-span-1 space-y-3">
              <div className="grid grid-cols-3 gap-3 relative">
                <GenericInput
                  label="First Name"
                  type="text"
                  placeHolder="First Name"
                  register={register("firstName")}
                  required
                />
                <GenericInput
                  label="Middle Name"
                  type="text"
                  placeHolder="Middle Name"
                  register={register("middleName")}
                  required
                />
                <GenericInput
                  label="Last Name"
                  type="text"
                  placeHolder="Last Name"
                  register={register("lastName")}
                  required
                />
                <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmitPatient;
