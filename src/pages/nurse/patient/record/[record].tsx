import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import Main from "@/components/Layout/Main";
import SuspenseComponent from "@/components/SuspenseComponent";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/schema/appointment.schema";
import {
  BillingMedicalRecordInput,
  DischargedMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "@/schema/medicalRecord.schema";
import {
  CreateMedicineInput,
  UpdateMedicineInput,
} from "@/schema/medicine.schema";
import { trpc } from "@/utils/trpc";
import { Dialog, TextField } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Appointment,
  AppointmentStatus,
  MedicalResult,
  MedicalStatus,
  Medicine,
  Physician,
  Room,
  RoomCat,
  User,
} from "@prisma/client";
import moment from "moment";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  Edit,
  Edit2,
  ExternalLink,
  Plus,
  Trash2,
  XSquare,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const TableStyle = (x: number) => {
  if (x % 2) {
    return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
  }
  return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
};

const Patient: NextPage = () => {
  const router = useRouter();
  const { record } = router.query;
  const [selectedCat, setSelectedCat] = useState<RoomCat>("WARD");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isBilling, setIsBilling] = useState<boolean>(false);
  const [isDischarged, setIsDischarged] = useState<boolean>(false);
  const [rooms, setRooms] = useState<
    {
      label: string;
      value: Room;
    }[]
  >();

  const {
    handleSubmit,
    register,
    control,
    formState: { isDirty },
    resetField,
    reset,
  } = useForm<UpdateMedicalRecordInput>();

  const { handleSubmit: handleBillingSubmit, register: registerBilling } =
    useForm<BillingMedicalRecordInput>();

  const {
    handleSubmit: handleDischargedSubmit,
    control: controlDischarged,
    register: registerDischarged,
    reset: resetDischarged,
  } = useForm<DischargedMedicalRecordInput>();

  const {
    data,
    refetch: refetchRecord,
    isLoading: isRecordLoading,
  } = trpc.useQuery(
    [
      "medicalRecord.get-record",
      {
        id: parseInt(record as unknown as string),
      },
    ],
    {
      onSuccess(res) {
        reset({
          id: res?.id,
          bloodPressure: res?.bloodPressure,
          chiefComplaint: res?.chiefComplaint,
          guardian: res?.guardian,
          height: res?.height,
          physicianId: res?.physicianId,
          roomId: res?.roomId,
          weight: res?.weight,
          guardianNo: res?.guardianNo,
        });

        if (res?.room) {
          const patientRoom = {
            label:
              "floor: " + res?.room.floor + " / room no: " + res?.room.roomNo,
            value: res?.room,
          };
          setRooms((prev) => (prev ? [patientRoom, ...prev] : [patientRoom]));
        }

        resetDischarged({
          medicalRecordId: res?.id,
          status: "Discharged",
          result: res?.result,
        });
      },
    }
  );

  const { mutate, isLoading, error } = trpc.useMutation(
    ["medicalRecord.update-record"],
    {
      onSuccess: () => {
        setIsEdit(false);
      },
    }
  );
  if (error) {
    console.log(error);
  }

  const { mutate: mutateBiling, isLoading: isBillingLoading } =
    trpc.useMutation(["medicalRecord.billing-record"], {
      onSuccess: () => {
        refetchRecord().then(() => {
          setIsBilling(false);
        });
      },
    });

  const { mutate: mutateDischarged, isLoading: isDischargedLoading } =
    trpc.useMutation(["medicalRecord.discharged-record"], {
      onSuccess: () => {
        refetchRecord().then(() => {
          setIsDischarged(false);
        });
      },
    });

  trpc.useQuery(
    ["room.get-available-rooms", { searchInput: "", category: selectedCat }],
    {
      onSuccess: (data) => {
        setRooms(
          data.map((room) => {
            return {
              label: "floor: " + room.floor + " / room no: " + room.roomNo,
              value: room,
            };
          })
        );
      },
    }
  );

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

  const roomCategory = (Object.keys(RoomCat) as (keyof typeof RoomCat)[]).map(
    (enumKey) => {
      return {
        label: RoomCat[enumKey].toLowerCase(),
        value: RoomCat[enumKey],
      };
    }
  );

  const recordStatus = (
    Object.keys(MedicalStatus) as (keyof typeof MedicalStatus)[]
  ).map((enumKey) => {
    return {
      label: MedicalStatus[enumKey].toLowerCase(),
      value: MedicalStatus[enumKey],
    };
  });

  const medicalResult = (
    Object.keys(MedicalResult) as (keyof typeof MedicalResult)[]
  ).map((enumKey) => {
    return {
      label: MedicalResult[enumKey].toLowerCase(),
      value: MedicalResult[enumKey],
    };
  });

  function onSubmit(values: UpdateMedicalRecordInput) {
    mutate({ ...values });
  }

  const admitedD = moment(data?.admittedAt);
  const nowD = moment(data?.receipt?.createAt ?? new Date());
  const roomTime = nowD.diff(admitedD, "days", true);
  const roomPrice = (data?.room ? data?.room?.price : 0) as unknown as number;
  const roomCharge = roomPrice * roomTime; //room total price

  const appointmentCharge = data?.appointments
    .map((appointment) => {
      const startD = moment(appointment?.start);
      const endD = moment(appointment.end);
      const totalTime = endD.diff(startD, "hours", true);
      const phyCharge = appointment.physician
        .sessionCharge as unknown as number;
      const subTotal = totalTime * phyCharge;
      const total = appointment.status === "Finished" ? subTotal : 0;

      return total;
    })
    .reduce((a, b) => a + b, 0) as unknown as number;

  const medicineCharge = data?.medicine
    .map((item) => item.total)
    .reduce((a, b) => {
      const totalA = a as unknown as string;
      const totalB = b as unknown as string;
      const total = parseFloat(totalA) + parseFloat(totalB);

      return total as unknown as number;
    }, 0) as unknown as number;

  const totalCharge = roomCharge + appointmentCharge + medicineCharge;

  function onBillingSubmit(values: BillingMedicalRecordInput) {
    if (data) {
      mutateBiling({
        ...values,
        medicalRecordId: data?.id,
        total: totalCharge,
      });
    }
  }

  function onDischargedSubmit(values: DischargedMedicalRecordInput) {
    if (data) {
      mutateDischarged({
        ...values,
        medicalRecordId: data?.id,
      });
    }
  }

  return (
    <>
      <Head>
        <title>Nurse - Record Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <SuspenseComponent isLoading={isRecordLoading}>
          <div className="flex-1 h-full w-full space-y-5 overflow-x-hidden">
            <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
              <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-400">
                    Patient Record
                  </h1>
                </div>
                {!isEdit ? (
                  <div className="space-x-5 flex">
                    <div>
                      <OutlinedButton onClick={() => router.back()}>
                        <ArrowLeft size={24} />
                      </OutlinedButton>
                    </div>
                    {!data?.discharedAt ? (
                      <>
                        {!data?.receipt ? (
                          <>
                            <PrimaryButton onClick={() => setIsEdit(true)}>
                              <Edit2 size={24} />
                            </PrimaryButton>
                            <SecondaryButton onClick={() => setIsBilling(true)}>
                              <DollarSign size={24} />
                            </SecondaryButton>
                          </>
                        ) : (
                          <SecondaryButton
                            onClick={() => setIsDischarged(true)}
                          >
                            <ExternalLink size={24} />
                          </SecondaryButton>
                        )}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="w-full h-auto relative">
                {isEdit ? null : (
                  <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"></div>
                )}
                <div className="relative w-full h-auto p-2 flex justify-center overflow-hidden">
                  <form className="max-w-9xl" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-lg font-bold text-gray-900 mb-5 capitalize">
                      {data?.patient?.lastName +
                        ", " +
                        data?.patient?.firstName +
                        " " +
                        data?.patient?.middleName}
                    </h1>
                    <div className="flex flex-col">
                      <div className="col-span-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <GenericInput
                            label="Height"
                            type="text"
                            placeHolder="Height"
                            register={register("height")}
                          />
                          <GenericInput
                            label="Weight"
                            type="text"
                            placeHolder="Weight"
                            register={register("weight")}
                          />
                          <GenericInput
                            label="Blood Pressure"
                            type="text"
                            placeHolder="Blood Pressure"
                            register={register("bloodPressure")}
                          />
                        </div>

                        <Controller
                          control={control}
                          name="roomId"
                          render={({ field: { onChange, value } }) => (
                            <div className="grid grid-cols-2 gap-2 items-end">
                              <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                  Room Type
                                </label>
                                <Select
                                  className="capitalize"
                                  classNamePrefix="addl-class"
                                  placeholder="Room Catergory..."
                                  options={roomCategory}
                                  value={roomCategory?.find(
                                    (cat) => cat.value === selectedCat
                                  )}
                                  onChange={(e) => {
                                    resetField("roomId");
                                    onChange(undefined);
                                    setSelectedCat(e?.value as RoomCat);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                  Room
                                </label>
                                <Select
                                  className="capitalize"
                                  classNamePrefix="addl-class"
                                  options={rooms}
                                  value={rooms?.find(
                                    (c) =>
                                      c.value.id === value &&
                                      c.value.category === selectedCat
                                  )}
                                  onChange={(room) => {
                                    if (room) {
                                      onChange(room?.value.id);
                                      setSelectedCat(
                                        room?.value.category as RoomCat
                                      );
                                    } else {
                                      setSelectedCat("WARD");
                                      onChange(undefined);
                                    }
                                  }}
                                  placeholder="Room"
                                  isClearable
                                />
                              </div>
                            </div>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col justify-between">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                              Physician
                            </label>
                            <Controller
                              control={control}
                              name="physicianId"
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  className="capitalize"
                                  classNamePrefix="addl-class"
                                  options={physicians}
                                  value={physicians?.find(
                                    (c) => c.value === value
                                  )}
                                  onChange={(physicians) =>
                                    onChange(physicians?.value)
                                  }
                                  placeholder="Physician"
                                  isSearchable
                                />
                              )}
                            />
                          </div>
                          <GenericInput
                            label="Chief Complaint"
                            type="text"
                            placeHolder="Address"
                            register={register("chiefComplaint")}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <GenericInput
                            label="Guardian"
                            type="text"
                            placeHolder="Guardian"
                            register={register("guardian")}
                          />
                          <GenericInput
                            label="Guardian No"
                            type="text"
                            placeHolder="Guardian No"
                            register={register("guardianNo")}
                          />
                        </div>
                      </div>

                      {data?.receipt ? (
                        <>
                          <h1 className="text-base font-bold text-gray-900 mt-5 capitalize">
                            Billing Summary
                          </h1>
                          <div className="col-span-1 space-y-3 mt-5">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Room Charges
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data?.receipt.roomCharge?.toString()}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Appointment Charges
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data?.receipt.appointmentCharge?.toString()}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Medicine Charges
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data?.receipt.medicineCharge?.toString()}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Reference #
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.receipt.id}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Total Charges
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {totalCharge.toFixed(2)}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {data?.discharedAt ? (
                        <>
                          <h1 className="text-base font-bold text-gray-900 mt-5 capitalize">
                            Discharged Summary
                          </h1>
                          <div className="col-span-1 space-y-3 mt-5">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Addmitting Diagnosis
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.admittingDiagnosis}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Final Diagnosis
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.finalDiagnosis}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Other Diagnosis
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.otherDiagnosis}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Medical Result
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.result}
                                  </h3>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700">
                                  Disposition
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm ">
                                  <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                                    {data.status}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="w-full my-5 flex justify-end">
                      {isEdit ? (
                        <div className="py-3 w-1/2 text-right flex gap-2 justify-end">
                          <PrimaryButton
                            className="w-full"
                            type="submit"
                            disabled={!isDirty}
                            isLoading={isLoading}
                          >
                            Update
                          </PrimaryButton>
                          <OutlinedButton
                            type="button"
                            onClick={() => setIsEdit(false)}
                          >
                            Cancel
                          </OutlinedButton>
                        </div>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {!isEdit ? (
              <>
                <PatientAppointments
                  appointments={data?.appointments}
                  isDisabled={data?.receipt ? true : false}
                  refetchRecord={refetchRecord}
                />
                <PatientMedicines
                  medicines={data?.medicine}
                  isDisabled={data?.receipt ? true : false}
                  refetchRecord={refetchRecord}
                />
              </>
            ) : null}
            <Dialog
              open={isBilling}
              onClose={() => setIsBilling(false)}
              maxWidth="md"
            >
              <div className="w-[900px] h-screen">
                <div className="w-full h-auto flex justify-end p-5">
                  <div className="w-fit">
                    <OutlinedButton onClick={() => setIsBilling(false)}>
                      <XSquare size={24} />
                    </OutlinedButton>
                  </div>
                </div>
                <form
                  className="flex-1 flex flex-col items-center mt-5 mb-20"
                  onSubmit={handleBillingSubmit(onBillingSubmit)}
                >
                  <div className="flex flex-col w-full max-w-md">
                    <div className="col-span-1 space-y-3">
                      <div className="col-span-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Room Charge
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {roomCharge && roomCharge.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Appointment Charge
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {appointmentCharge &&
                                appointmentCharge.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Medicine Charge
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {medicineCharge && medicineCharge.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Total Charge
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {totalCharge.toFixed(2)}
                            </h3>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Philhealth Id
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <input
                              type={"text"}
                              className="block w-full h-12 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                              {...registerBilling("philHealthId")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full max-w-md my-5 flex justify-end">
                        <div className="py-3 text-right flex gap-2 justify-end">
                          <PrimaryButton
                            className="w-full min-w-[150px]"
                            isLoading={isBillingLoading}
                            type="submit"
                          >
                            Bill
                          </PrimaryButton>

                          <OutlinedButton
                            type="button"
                            onClick={() => setIsBilling(false)}
                          >
                            Cancel
                          </OutlinedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </Dialog>

            <Dialog
              open={isDischarged}
              onClose={() => setIsDischarged(false)}
              maxWidth="md"
            >
              <div className="w-[900px] h-screen">
                <div className="w-full h-auto flex justify-end p-5">
                  <div className="w-fit">
                    <OutlinedButton onClick={() => setIsDischarged(false)}>
                      <XSquare size={24} />
                    </OutlinedButton>
                  </div>
                </div>
                <form
                  className="flex-1 flex flex-col items-center mt-5 mb-20"
                  onSubmit={handleDischargedSubmit(onDischargedSubmit)}
                >
                  <div className="flex flex-col w-full max-w-md">
                    <div className="col-span-1 space-y-3">
                      <div className="col-span-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Addmitting Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <input
                              type={"text"}
                              className="block w-full h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                              {...registerDischarged("admittingDiagnosis")}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Final Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <input
                              type={"text"}
                              className="block w-full h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                              {...registerDischarged("finalDiagnosis")}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Other Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <input
                              type={"text"}
                              className="block w-full h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm focus:outline-green-500"
                              {...registerDischarged("otherDiagnosis")}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            Result
                          </label>
                          <Controller
                            control={controlDischarged}
                            name="result"
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="capitalize"
                                classNamePrefix="aDDl-class"
                                options={medicalResult}
                                value={medicalResult?.find(
                                  (c) => c.value === value
                                )}
                                onChange={(medicalResult) =>
                                  onChange(medicalResult?.value)
                                }
                                placeholder="Result"
                                isSearchable
                              />
                            )}
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            Status
                          </label>
                          <Controller
                            control={controlDischarged}
                            name="status"
                            render={({ field: { onChange, value } }) => (
                              <Select
                                className="capitalize"
                                classNamePrefix="aDDl-class"
                                options={recordStatus}
                                value={recordStatus?.find(
                                  (c) => c.value === value
                                )}
                                onChange={(recordStatus) =>
                                  onChange(
                                    recordStatus?.value === "Admitted"
                                      ? "Discharged"
                                      : recordStatus?.value
                                  )
                                }
                                placeholder="Status"
                                isSearchable
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-full max-w-md my-5 flex justify-end">
                        <div className="py-3 text-right flex gap-2 justify-end">
                          <PrimaryButton
                            className="w-full min-w-[150px]"
                            isLoading={isDischargedLoading}
                            type="submit"
                          >
                            Discharged
                          </PrimaryButton>

                          <OutlinedButton
                            type="button"
                            onClick={() => setIsDischarged(false)}
                          >
                            Cancel
                          </OutlinedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </Dialog>
          </div>
        </SuspenseComponent>
      </Main>
    </>
  );
};

function PatientAppointments({
  appointments,
  isDisabled,
  refetchRecord,
}: {
  appointments?: (Appointment & {
    physician: Physician & {
      user: User;
    };
  })[];
  isDisabled?: boolean;
  refetchRecord?: any;
}) {
  const dateNow = new Date();
  const router = useRouter();
  const { record } = router.query;
  const [create, setCreate] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

  const {
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    control: controlCreate,
    formState: { isDirty: isCreateDirty },
    getValues: getCreateValues,
    setError: setCreateError,
  } = useForm<CreateAppointmentInput>();

  const {
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    control: controlUpdate,
    formState: { isDirty: isUpdateDirty },
    getValues: getUpdateValues,
  } = useForm<UpdateAppointmentInput>();

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

  const appointmentStatus = (
    Object.keys(AppointmentStatus) as (keyof typeof AppointmentStatus)[]
  ).map((enumKey) => {
    return {
      label: AppointmentStatus[enumKey].toLowerCase(),
      value: AppointmentStatus[enumKey],
    };
  });

  const {
    mutate: createMutate,
    isLoading: isCreateLoading,
    error: createError,
  } = trpc.useMutation("appointment.create-appointment", {
    onSuccess: ({ MedicalRecord }) => {
      setPatientAppointment(MedicalRecord?.appointments);
      resetCreate();
      setCreate(false);
      refetchRecord();
    },
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = trpc.useMutation(
    "appointment.update-appointment",
    {
      onSuccess: (data) => {
        setPatientAppointment((prev) =>
          prev?.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            return item;
          })
        );
        resetUpdate();
        setUpdate(false);
        refetchRecord();
      },
    }
  );

  const { mutate: deleteMutate } = trpc.useMutation(
    "appointment.delete-appointment",
    {
      onMutate: (variables) => {
        setPatientAppointment((prev) =>
          prev?.filter((item) => item.id !== variables.id)
        );
      },
      onSuccess: () => {
        refetchRecord();
      },
    }
  );

  useEffect(() => {
    if (appointments) {
      setPatientAppointment(appointments);
    }
  }, [appointments]);

  function onCreateSubmit(values: CreateAppointmentInput) {
    createMutate({
      ...values,
      start: moment(values.start).toDate(),
      end: moment(values.end).toDate(),
      medicalRecordId: parseInt(record as unknown as string),
    });
  }

  function onUpdateSubmit(values: UpdateAppointmentInput) {
    updateMutate({
      ...values,
      start: moment(values.start).toDate(),
      end: moment(values.end).toDate(),
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

  const appointmentCharge = appointments
    ?.map((appointment) => {
      const startD = moment(appointment?.start);
      const endD = moment(appointment.end);
      const totalTime = endD.diff(startD, "hours", true);

      console.log(totalTime);
      const phyCharge = appointment.physician
        .sessionCharge as unknown as number;
      const subTotal = totalTime * phyCharge;
      const total = appointment.status === "Finished" ? subTotal : 0;

      return total;
    })
    .reduce((a, b) => a + b, 0) as unknown as number;

  const createCloseClick = () => {
    setCreate(false);
    resetCreate();
  };

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
            {!isDisabled ? (
              <SecondaryButton onClick={() => setCreate(true)}>
                <Plus size={24} />
              </SecondaryButton>
            ) : null}
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Appointment Id
              </th>
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
              {!isDisabled ? (
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              ) : null}
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
                      Appointment {appointment.id}
                    </th>
                    <td className="py-4 px-6">
                      {appointment.physician.user.firstName}{" "}
                      {appointment.physician.user.lastName}
                    </td>
                    <td className="py-4 px-6">
                      {moment(appointment?.start).format(
                        "MMM DD, YYYY hh:mm A"
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {moment(appointment?.end).format("MMM DD, YYYY hh:mm A")}
                    </td>
                    <td className="py-4 px-6">{appointment.status}</td>
                    {!isDisabled ? (
                      <td className="py-4 px-6 flex gap-5">
                        <span
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                          onClick={() => {
                            resetUpdate({
                              id: appointment.id,
                              end: appointment.end as Date,
                              physicianId: appointment.physicianId,
                              start: appointment.start as Date,
                              status: appointment.status,
                            });
                            setUpdate(true);
                          }}
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
                    ) : null}
                  </tr>
                );
              })}
              {!PatientAppointments ? <>No Medicines Data</> : null}
            </tbody>
          </Suspense>
        </table>
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5 mr-20">
          <div></div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg  text-gray-900">Total :</h1>
            <h1 className="text-lg  text-gray-900">
              {appointmentCharge?.toFixed(2)}
            </h1>
          </div>
        </div>
      </div>
      <Dialog open={create} onClose={createCloseClick} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-5">
            <div className="w-fit">
              <OutlinedButton onClick={createCloseClick}>
                <XSquare size={24} />
              </OutlinedButton>
            </div>
          </div>
          {createError && (
            <div
              className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              <span className="font-medium">Error alert! </span>
              {createError && createError.message}
            </div>
          )}
          <form
            className="flex-1 flex flex-col items-center mt-5 mb-20"
            onSubmit={handleCreateSubmit(onCreateSubmit)}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
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
                          classNamePrefix="aDDl-class"
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
                          value={value ? value : dateNow}
                          onChange={(newValue) => {
                            onChange(newValue ?? dateNow);
                          }}
                          minDateTime={moment(dateNow)}
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
                          value={value ? value : dateNow}
                          onChange={(newValue) => {
                            onChange(newValue ?? dateNow);
                          }}
                          minDateTime={moment(getCreateValues("start"))}
                          onError={() =>
                            setCreateError(
                              "end",
                              { type: "onChange", message: "error" },
                              {
                                shouldFocus: true,
                              }
                            )
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </LocalizationProvider>
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

                <OutlinedButton type="button" onClick={createCloseClick}>
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
      <Dialog open={update} onClose={() => setUpdate(false)} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-5">
            <div className="w-fit">
              <OutlinedButton onClick={() => setUpdate(false)}>
                <XSquare size={24} />
              </OutlinedButton>
            </div>
          </div>
          <form
            className="flex-1 flex flex-col items-center mt-5 mb-20"
            onSubmit={handleUpdateSubmit(onUpdateSubmit)}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <div className="flex flex-col w-full max-w-md">
                <div className="col-span-1 space-y-3">
                  <div className="flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Physician
                    </label>
                    <Controller
                      control={controlUpdate}
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
                      control={controlUpdate}
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
                          value={value ? value : dateNow}
                          onChange={(newValue) => {
                            onChange(newValue ?? dateNow);
                          }}
                          minDateTime={moment(dateNow)}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Schedule End
                    </label>
                    <Controller
                      control={controlUpdate}
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
                          value={value ? value : dateNow}
                          onChange={(newValue) => {
                            onChange(newValue ?? dateNow);
                          }}
                          minDateTime={moment(getUpdateValues("start"))}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Status
                    </label>
                    <Controller
                      control={controlUpdate}
                      name="status"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          className="capitalize"
                          classNamePrefix="addl-class"
                          options={appointmentStatus}
                          value={appointmentStatus.find(
                            (c) => c.value === value
                          )}
                          onChange={(status) => onChange(status?.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </LocalizationProvider>
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

function PatientMedicines({
  medicines,
  isDisabled,
  refetchRecord,
}: {
  medicines?: Medicine[];
  isDisabled?: boolean;

  refetchRecord?: any;
}) {
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
        refetchRecord();
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
        refetchRecord();
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
      onSuccess: () => {
        refetchRecord();
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

  const medicineCharge = medicines
    ?.map((item) => item.total)
    .reduce((a, b) => {
      const totalA = a as unknown as string;
      const totalB = b as unknown as string;
      const total = parseFloat(totalA) + parseFloat(totalB);

      return total as unknown as number;
    }, 0) as unknown as number;

  const createCloseClick = () => {
    setCreate(false);
    reset();
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
            {!isDisabled ? (
              <SecondaryButton onClick={() => setCreate(true)}>
                <Plus size={24} />
              </SecondaryButton>
            ) : null}
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
              {!isDisabled ? (
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              ) : null}
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
                    {!isDisabled ? (
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
                    ) : null}
                  </tr>
                );
              })}
              {!patientMedicine ? <>No Medicines Data</> : null}
            </tbody>
          </Suspense>
        </table>
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5 mr-20">
          <div></div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg  text-gray-900">Total :</h1>
            <h1 className="text-lg  text-gray-900">
              {medicineCharge?.toFixed(2)}
            </h1>
          </div>
        </div>
      </div>
      <Dialog open={create} onClose={createCloseClick} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-5">
            <div className="w-fit">
              <OutlinedButton onClick={createCloseClick}>
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

                <OutlinedButton type="button" onClick={createCloseClick}>
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
      <Dialog open={update} onClose={() => setUpdate(false)} maxWidth="md">
        <div className="w-[900px] h-screen">
          <div className="w-full h-auto flex justify-end p-5">
            <div className="w-fit">
              <OutlinedButton onClick={() => setUpdate(false)}>
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
