import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import Main from "@/components/Layout/Main";
import { CreateAppointmentInput } from "@/schema/appointment.schema";
import {
  CreateMedicineInput,
  UpdateMedicineInput,
} from "@/schema/medicine.schema";
import { trpc } from "@/utils/trpc";
import { Dialog, TextField } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Appointment, Medicine, Physician, User } from "@prisma/client";
import moment, { Moment } from "moment";
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
    // console.log(data);
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

const TableStyle = (x: number) => {
  if (x % 2) {
    return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
  }
  return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
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
  const router = useRouter();
  const { record } = router.query;
  const [create, setCreate] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

  const {
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    control: controlCreate,
    formState: { isDirty: isCreateDirty },
  } = useForm<CreateAppointmentInput>();

  const [PatientAppointments, setPatientAppointment] = useState<
    | (Appointment & {
        physician: Physician & {
          user: User;
        };
      })[]
    | undefined
  >();

  const { data: physiciansData } = trpc.useQuery([
    "physician.all-physicians",
    { name: "" },
  ]);

  const physicians = physiciansData?.map(({ id, user }) => {
    return {
      label: user.lastName + " " + user.firstName,
      value: id,
    };
  });

  const { mutate: createMutate, isLoading: isCreateLoading } = trpc.useMutation(
    "appointment.create-appointment",
    {
      onSuccess: ({ MedicalRecord }) => {
        setPatientAppointment(MedicalRecord?.appointments);
        resetCreate();
        setCreate(false);
      },
    }
  );

  const { mutate: deleteMutate } = trpc.useMutation(
    "appointment.delete-appointment",
    {
      onMutate: (variables) => {
        setPatientAppointment((prev) =>
          prev?.filter((items) => items.id !== variables.id)
        );
      },
    }
  );

  useEffect(() => {
    if (appointments) {
      setPatientAppointment(appointments);
    }
  }, [appointments]);

  function onCreateSubmit(values: CreateAppointmentInput) {
    const start = values.start as unknown as Moment;
    const end = values.end as unknown as Moment;

    createMutate({
      ...values,
      start: start.toDate(),
      end: end.toDate(),
      medicalRecordId: parseInt(record as unknown as string),
    });
  }

  const deleteDialog = ({
    appointment,
  }: {
    appointment: Appointment & {
      physician: Physician & {
        user: User;
      };
    };
  }) => {
    if (window.confirm("Are you sure to Delete this Appointment Data?")) {
      deleteMutate({ ...appointment });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Physician
              </th>
              <th scope="col" className="py-3 px-6">
                Schedule Start
              </th>
              <th scope="col" className="py-3 px-6">
                Schedule End
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <Suspense>
            <tbody>
              {PatientAppointments?.map((appointment, i) => {
                return (
                  <tr key={i} className={`${TableStyle(i)}`}>
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                    >
                      {appointment.physician.user.firstName}
                    </th>
                    <td className="py-4 px-6">
                      {moment(appointment?.start).format("MMM d, YYYY hh:mm A")}
                    </td>
                    <td className="py-4 px-6">
                      {moment(appointment?.end).format("MMM d, YYYY hh:mm A")}
                    </td>
                    <td className="py-4 px-6">{appointment.status}</td>
                    <td className="py-4 px-6 flex gap-5">
                      <span
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                        // onClick={() => {
                        //   updateReset({
                        //     id: medicine.id,
                        //     name: medicine.name as string,
                        //     price: medicine.price as unknown as number,
                        //     quantity: medicine.quantity as number,
                        //   });
                        //   setUpdate(true);
                        // }}
                      >
                        <Edit size={20} />
                      </span>
                      <span
                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                        onClick={() => deleteDialog({ appointment })}
                      >
                        <Trash2 size={20} />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!PatientAppointments ? <>No Medicines Data</> : null}
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
            onSubmit={handleCreateSubmit(onCreateSubmit)}
          >
            <div className="flex flex-col w-full max-w-md">
              <div className="col-span-1 space-y-3">
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Physician
                  </label>
                  <Controller
                    control={controlCreate}
                    name="physicianId"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="capitalize"
                        classNamePrefix="addl-class"
                        options={physicians}
                        value={physicians?.find((c) => c.value === value)}
                        onChange={(physicians) => onChange(physicians?.value)}
                        placeholder="Physician"
                        isSearchable
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Schedule Start
                  </label>
                  <Controller
                    control={controlCreate}
                    name="start"
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField
                            size="small"
                            {...props}
                            sx={{ width: "100%" }}
                          />
                        )}
                        value={value ? value : new Date()}
                        onChange={(newValue) => {
                          onChange(newValue ?? new Date());
                        }}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Schedule End
                  </label>
                  <Controller
                    control={controlCreate}
                    name="end"
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField
                            size="small"
                            {...props}
                            sx={{ width: "100%" }}
                          />
                        )}
                        value={value ? value : new Date()}
                        onChange={(newValue) => {
                          onChange(newValue ?? new Date());
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-full max-w-md my-5 flex justify-end">
              <div className="py-3 text-right flex gap-2 justify-end">
                <PrimaryButton
                  className="w-full min-w-[150px]"
                  isLoading={isCreateLoading}
                  disabled={!isCreateDirty}
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
    </LocalizationProvider>
  );
}

function PatientMedicines({ medicines }: { medicines?: Medicine[] }) {
  const router = useRouter();
  const { record } = router.query;
  const [create, setCreate] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [patientMedicine, setPatientMedicine] = useState<
    Medicine[] | undefined
  >();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty },
  } = useForm<CreateMedicineInput>();

  const {
    handleSubmit: handleUpdateSubmit,
    register: updateRegister,
    reset: updateReset,
    formState: { isDirty: isUpdateDirty },
  } = useForm<UpdateMedicineInput>();

  const { mutate: addMutate, isLoading: isAddLoading } = trpc.useMutation(
    ["medicine.add-medicine"],
    {
      onSuccess: ({ medicine }) => {
        setPatientMedicine(medicine);
        setCreate(false);
        reset();
      },
    }
  );

  const { mutate: updateMutate, isLoading: isUpdateLoading } = trpc.useMutation(
    ["medicine.update-medicine"],
    {
      onSuccess: (data) => {
        setPatientMedicine((prev) =>
          prev?.map((med) => {
            if (med.id === data.id) {
              return data;
            }
            return med;
          })
        );
        setUpdate(false);
        updateReset();
      },
    }
  );

  const { mutate: deleteMutate } = trpc.useMutation(
    ["medicine.delete-medicine"],
    {
      onMutate: (variables) => {
        setPatientMedicine((prev) =>
          prev?.filter((items) => items.id !== variables.id)
        );
      },
    }
  );

  useEffect(() => {
    if (medicines) {
      setPatientMedicine(medicines);
    }
  }, [medicines]);

  function onAddSubmit(values: CreateMedicineInput) {
    addMutate({
      ...values,
      medicalRecordId: parseInt(record as unknown as string),
    });
  }

  function onUpdateSubmit(values: UpdateMedicineInput) {
    updateMutate({
      ...values,
    });
  }

  const deleteDialog = ({ medicine }: { medicine: Medicine }) => {
    if (window.confirm("Are you sure to Delete this Medicine Data?")) {
      deleteMutate({ ...medicine });
    }
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
                        onClick={() => {
                          updateReset({
                            id: medicine.id,
                            name: medicine.name as string,
                            price: medicine.price as unknown as number,
                            quantity: medicine.quantity as number,
                          });
                          setUpdate(true);
                        }}
                      >
                        <Edit size={20} />
                      </span>
                      <span
                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                        onClick={() => deleteDialog({ medicine })}
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
            onSubmit={handleSubmit(onAddSubmit)}
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
      <Dialog open={update} onClose={() => setUpdate(false)} maxWidth="md">
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
            onSubmit={handleUpdateSubmit(onUpdateSubmit)}
          >
            <div className="flex flex-col w-full max-w-md">
              <div className="col-span-1 space-y-3">
                <GenericInput
                  label="Name"
                  type="text"
                  placeHolder="Name"
                  required
                  register={updateRegister("name")}
                />
                <GenericInput
                  label="Quantity"
                  type="number"
                  placeHolder="Quantity"
                  required
                  register={updateRegister("quantity", {
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
                  register={updateRegister("price", {
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
                  isLoading={isUpdateLoading}
                  disabled={!isUpdateDirty}
                  type="submit"
                >
                  Update
                </PrimaryButton>

                <OutlinedButton type="button" onClick={() => setUpdate(false)}>
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
