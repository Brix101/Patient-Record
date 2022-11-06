import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { UpdatePatientInput } from "@/schema/patient.schema";
import { trpc } from "@/utils/trpc";
import { CivilStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { patientsState, togglePatientEditMode } from "./patientsSlice";

const PatientForm: NextPage = () => {
  const dispatch = useAppDispatch();
  const { patient, isEditPatient } = useAppSelector(patientsState);

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
        dispatch(togglePatientEditMode());
        console.log("success");
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

  const handleCancelUpdate = () => {
    dispatch(togglePatientEditMode());
  };

  return (
    <>
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
        {isEditPatient ? null : (
          <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"></div>
        )}
        <form className="max-w-9xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="col-span-1 space-y-3">
              <div className="grid grid-cols-3 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Gender
                  </label>
                  <Controller
                    control={control}
                    defaultValue={"MALE"}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="capitalize"
                        classNamePrefix="addl-class"
                        options={genderOptions}
                        value={genderOptions.find((c) => c.value === value)}
                        onChange={(gender) => onChange(gender?.value)}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Blood Type
                  </label>
                  <Controller
                    control={control}
                    defaultValue={"O+"}
                    name="bloodType"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="capitalize"
                        classNamePrefix="addl-class"
                        options={bloodType}
                        value={bloodType.find((c) => c.value === value)}
                        onChange={(gender) => onChange(gender?.value)}
                        placeholder="Blood Type"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Birthdate
                  </label>
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field }) => (
                      <ReactDatePicker
                        className="block w-full h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
                        placeholderText="Select date (MMMM-dd-yyyy)"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat="MMMM-dd-yyyy"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Civil Status
                  </label>
                  <Controller
                    control={control}
                    name="civilStatus"
                    defaultValue={"Single"}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="capitalize"
                        classNamePrefix="addl-class"
                        options={civilStatus}
                        value={civilStatus.find((c) => c.value === value)}
                        onChange={(civilStatus) => onChange(civilStatus?.value)}
                        placeholder="Civil Status"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <GenericInput
                  label="Mobile Number"
                  type="text"
                  placeHolder="Mobile"
                  register={register("mobile")}
                />
                <GenericInput
                  label="Religion"
                  type="text"
                  placeHolder="Religion"
                  register={register("religion")}
                />
                <GenericInput
                  label="Nationality"
                  type="text"
                  placeHolder="Nationality"
                  register={register("nationality")}
                />
              </div>
              <GenericInput
                label="Address"
                type="text"
                placeHolder="Address"
                register={register("address")}
              />
            </div>
          </div>
          {isEditPatient ? (
            <div className="w-full mt-5 flex justify-end ">
              <div className="py-3 w-1/2 text-right flex gap-2 justify-end">
                <PrimaryButton
                  className="w-full"
                  type="submit"
                  disabled={!isDirty}
                  isLoading={isLoading}
                >
                  Update
                </PrimaryButton>
                <OutlinedButton type="button" onClick={handleCancelUpdate}>
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default PatientForm;
