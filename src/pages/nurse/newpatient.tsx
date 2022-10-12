import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import Main from "@/components/Layout/Main";
import { CreateUserInput } from "@/schema/user.schema";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ReactDatePicker from "react-datepicker";
import { List } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const NewPatient: NextPage = () => {
  const { handleSubmit, register, reset, control } = useForm<CreateUserInput>();

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

  return (
    <>
      <Head>
        <title>Nurse - New Patient</title>
        <link rel="icon" href="/logo.svg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
        />
      </Head>
      <Main>
        <main className="h-auto w-full px-2">
          <div className="h-14 w-full flex justify-between items-center px-5">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">New Patient</h1>
            </div>

            <Link href="/nurse">
              <SecondaryButton className="w-11">
                <List size={24} />
              </SecondaryButton>
            </Link>
          </div>

          <div className="relative w-full h-auto p-2 flex justify-center overflow-hidden">
            <form className="max-w-9xl">
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="col-span-1 space-y-3">
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <GenericInput
                      label="First Name"
                      type="text"
                      placeHolder="First Name"
                      required
                    />
                    <GenericInput
                      label="Last Name"
                      type="text"
                      placeHolder="Last Name"
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
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                  <GenericInput
                    label="Mobile Number"
                    type="text"
                    placeHolder="Mobile"
                    required
                  />

                  <GenericInput
                    label="Address"
                    type="text"
                    placeHolder="Address"
                    required
                  />
                  <GenericInput
                    label="Civil Status"
                    type="text"
                    placeHolder="Civil Status"
                    required
                  />
                  <GenericInput
                    label="Nationality"
                    type="text"
                    placeHolder="Nationality"
                    required
                  />
                </div>
                <div className="col-span-1 space-y-3">
                  <GenericInput
                    label="Weight"
                    type="text"
                    placeHolder="Weight"
                    required
                  />
                  <GenericInput
                    label="Height"
                    type="text"
                    placeHolder="Height"
                    required
                  />
                  <GenericInput
                    label="Blood Pressure"
                    type="text"
                    placeHolder="Blood Pressure"
                    required
                  />
                  <GenericInput
                    label="Blood Type"
                    type="text"
                    placeHolder="Blood Type"
                    required
                  />
                  <GenericInput
                    label="Religion"
                    type="text"
                    placeHolder="Religion"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="py-3 text-right">
                  <PrimaryButton className="w-1/3" type="submit">
                    Add Patient
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </main>
      </Main>
    </>
  );
};

export default NewPatient;
