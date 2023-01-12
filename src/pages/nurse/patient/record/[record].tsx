import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import Main from "@/components/Layout/Main";
import SuspenseComponent from "@/components/SuspenseComponent";
import { CreateMedicineInput } from "@/schema/medicine.schema";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@mui/material";
import { Appointment, Medicine, Physician, User } from "@prisma/client";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Edit, Plus, Trash2, XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const PatientForm = dynamic(() => import("@features/patients/PatientForm"), {
  ssr: false,
});

const Patient: NextPage = () => {
  const router = useRouter();
  const { record } = router.query;
  const { data, isLoading } = trpc.useQuery(
    [
      "medicalRecord.get-record",
      {
        id: parseInt(record as unknown as string),
      },
    ],
    {
      onSuccess(res) {
        if (res) {
        }
      },
    }
  );

  if (data) {
    console.log(data);
  }
  return (
    <>
      <Head>
        <title>Nurse - Record Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="flex-1 h-full w-full space-y-5 overflow-x-hidden">
          <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
            <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-400">
                  Patient Record
                </h1>
              </div>
              <div>
                <SecondaryButton onClick={() => router.back()}>
                  <ArrowLeft size={24} />
                </SecondaryButton>
              </div>
            </div>
            <div className="w-full h-auto">
              <PatientForm />
            </div>
          </div>
          <PatientAppointments appointments={data?.appointments} />
          <PatientMedicines medicines={data?.medicine} />
        </div>
      </Main>
    </>
  );
};

function PatientAppointments({
  appointments,
}: {
  appointments?: (Appointment & {
    physician: Physician & {
      user: User;
    };
  })[];
}) {
  const [create, setCreate] = useState<boolean>(false);
  return (
    <>
      <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-400">
              Patient Appointments
            </h1>
          </div>
          <div>
            <SecondaryButton onClick={() => setCreate(true)}>
              <Plus size={24} />
            </SecondaryButton>
          </div>
        </div>
      </div>
      <Dialog open={create} onClose={() => setCreate(false)} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-10">
            <div className="w-fit">
              <OutlinedButton>
                <XSquare size={24} />
              </OutlinedButton>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function PatientMedicines({ medicines }: { medicines?: Medicine[] }) {
  const router = useRouter();
  const { record } = router.query;
  const [create, setCreate] = useState<boolean>(false);
  const [patientMedicine, setPatientMedicine] = useState<
    Medicine[] | undefined
  >();

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isDirty },
  } = useForm<CreateMedicineInput>();

  const {
    mutate: addMutate,
    error: addError,
    isLoading: isAddLoading,
    isSuccess: isAddSuccess,
  } = trpc.useMutation(["medicine.add-medicine"], {
    onSuccess: ({ medicine }) => {
      setPatientMedicine(medicine);
      setCreate(false);
      reset();
    },
  });

  useEffect(() => {
    if (medicines) {
      setPatientMedicine(medicines);
    }
  }, [medicines]);

  function onSubmit(values: CreateMedicineInput) {
    addMutate({
      ...values,
      medicalRecordId: parseInt(record as unknown as string),
    });
  }

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  return (
    <>
      <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-400">
              Patient Medicines
            </h1>
          </div>
          <div>
            <SecondaryButton onClick={() => setCreate(true)}>
              <Plus size={24} />
            </SecondaryButton>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Quantity
              </th>
              <th scope="col" className="py-3 px-6">
                price
              </th>
              <th scope="col" className="py-3 px-6">
                total
              </th>
              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <Suspense>
            <tbody>
              {patientMedicine?.map((medicine, i) => {
                return (
                  <tr key={i} className={`${TableStyle(i)}`}>
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                    >
                      {medicine.name}
                    </th>
                    <td className="py-4 px-6">{medicine.quantity}</td>
                    <td className="py-4 px-6">{medicine.price?.toString()}</td>
                    <td className="py-4 px-6">{medicine.total?.toString()}</td>
                    <td className="py-4 px-6 flex gap-5">
                      <span
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                        // onClick={() =>
                        //   dispatch(
                        //     setMedicinesMode({
                        //       mode: "Edit",
                        //       medicine: medicine,
                        //     })
                        //   )
                        // }
                      >
                        <Edit size={20} />
                      </span>
                      <span
                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                        // onClick={() => deleteDialog({ medicine })}
                      >
                        <Trash2 size={20} />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!patientMedicine ? <>No Medicines Data</> : null}
            </tbody>
          </Suspense>
        </table>
      </div>
      <Dialog open={create} onClose={() => setCreate(false)} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-10">
            <div className="w-fit">
              <OutlinedButton>
                <XSquare size={24} />
              </OutlinedButton>
            </div>
          </div>
          <form
            className="flex-1 flex flex-col items-center mt-5 mb-20"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full max-w-md">
              <div className="col-span-1 space-y-3">
                <GenericInput
                  label="Name"
                  type="text"
                  placeHolder="Name"
                  required
                  register={register("name")}
                />
                <GenericInput
                  label="Quantity"
                  type="number"
                  placeHolder="Quantity"
                  required
                  register={register("quantity", {
                    valueAsNumber: true,
                    validate: (value) => value > 0,
                    max: 999999999,
                  })}
                />

                <GenericInput
                  label="Price"
                  type="number"
                  placeHolder="Price"
                  required
                  register={register("price", {
                    valueAsNumber: true,
                    validate: (value) => value > 0,
                    max: 999999999,
                  })}
                />
              </div>
            </div>
            <div className="w-full max-w-md my-5 flex justify-end">
              <div className="py-3 text-right flex gap-2 justify-end">
                <PrimaryButton
                  className="w-full min-w-[150px]"
                  isLoading={isAddLoading}
                  disabled={!isDirty}
                  type="submit"
                >
                  Add
                </PrimaryButton>

                <OutlinedButton type="button" onClick={() => setCreate(false)}>
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default Patient;
