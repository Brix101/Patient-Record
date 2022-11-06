import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { AdmitPatientInput } from "@/schema/medicalRecord.schema";
import { trpc } from "@/utils/trpc";
import { RoomCat } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { patientsState, togglePatientAdmit } from "./patientsSlice";

const AdmitForm: NextPage = () => {
  const dispatch = useAppDispatch();
  const [selectedCat, setSelectedCat] = useState<RoomCat>("WARD");
  const { patient } = useAppSelector(patientsState);

  const {
    handleSubmit,
    register,
    control,
    clearErrors,
    formState: { isDirty },
    resetField,
  } = useForm<AdmitPatientInput>();

  const { data: roomData } = trpc.useQuery([
    "room.get-rooms",
    { searchInput: "", category: selectedCat },
  ]);

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

  const rooms = roomData?.map((room) => {
    return {
      label: room.floor + "/" + room.roomNo,
      value: room,
    };
  });

  return (
    <>
      {/* {error && (
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
      )} */}
      <div className="relative w-full h-auto p-2 flex justify-center overflow-hidden">
        <form className="max-w-9xl">
          <h1 className="text-lg font-bold text-gray-900 mb-5 capitalize">
            {patient?.lastName +
              ", " +
              patient?.firstName +
              " " +
              patient?.middleName}
          </h1>
          <div className="flex flex-col">
            <div className="col-span-1 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <GenericInput
                  label="Height"
                  type="text"
                  placeHolder="Height"
                  register={register("height")}
                  required
                />
                <GenericInput
                  label="Weight"
                  type="text"
                  placeHolder="Weight"
                  register={register("weight")}
                  required
                />
                <GenericInput
                  label="Blood Pressure"
                  type="text"
                  placeHolder="Blood Pressure"
                  register={register("bloodPressure")}
                  required
                />
              </div>

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
                      setSelectedCat(e?.value as RoomCat);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Room
                  </label>
                  <Controller
                    control={control}
                    name="roomId"
                    render={({ field: { onChange, value } }) => (
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
                            setSelectedCat(room?.value.category as RoomCat);
                          } else {
                            setSelectedCat("WARD");
                          }
                          onChange(room?.value.id);
                        }}
                        placeholder="Room"
                        isClearable
                      />
                    )}
                  />
                </div>
              </div>
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
                        value={physicians?.find((c) => c.value === value)}
                        onChange={(physicians) => onChange(physicians?.value)}
                        placeholder="Physician"
                        isSearchable
                      />
                    )}
                  />
                </div>
                <GenericInput
                  label="Guardian"
                  type="text"
                  placeHolder="Mobile"
                  register={register("guardian")}
                />
              </div>

              <GenericInput
                label="Chief Complaint"
                type="text"
                placeHolder="Address"
                register={register("chiefComplaint")}
              />
            </div>
          </div>
          <div className="w-full my-5 flex justify-end">
            <div className="py-3 w-1/2 text-right flex gap-2 justify-end">
              <PrimaryButton
                className="w-full"
                type="submit"
                disabled={!isDirty}
                // isLoading={isLoading}
              >
                Admit Patient
              </PrimaryButton>
              <OutlinedButton
                type="button"
                onClick={() => dispatch(togglePatientAdmit())}
              >
                Cancel
              </OutlinedButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdmitForm;
