import { useAppDispatch } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { AddPatientInput } from "@/schema/patient.schema";
import { trpc } from "@/utils/trpc";
import { CivilStatus } from "@prisma/client";
import type { NextPage } from "next";
import ReactDatePicker from "react-datepicker";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { setPatientsMode } from "./patientsSlice";

const NewPatient: NextPage = () => {
  const dispatch = useAppDispatch();
  const { handleSubmit, register, reset, control } = useForm<AddPatientInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    "patient.add-patient",
    {
      onSuccess: () => {
        reset();
      },
    }
  );

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

  function onSubmit(values: AddPatientInput) {
    mutate({ ...values });
  }

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        </div>
        <SecondaryButton
          className="w-11"
          onClick={() => dispatch(setPatientsMode({ mode: "View" }))}
        >
          <ArrowLeft size={24} />
        </SecondaryButton>
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
          <span className="font-medium">Success alert!</span> Patient Added
        </div>
      )}
      <div className="relative w-full h-auto p-2 flex justify-center overflow-y-auto ">
        <form
          className="max-w-9xl py-5 mb-20"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <div className="w-full my-5 flex justify-end">
            <div className="py-3 w-1/2 text-right flex gap-2 justify-end">
              <PrimaryButton
                className="w-full"
                type="submit"
                isLoading={isLoading}
              >
                Add Patient
              </PrimaryButton>
              <OutlinedButton
                type="button"
                onClick={() => dispatch(setPatientsMode({ mode: "View" }))}
              >
                Cancel
              </OutlinedButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatient;
