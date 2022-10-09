import { useAppDispatch } from "@/app/hook";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { CreateRoomInput } from "@/schema/room.schema";
import { ErrorMessage } from "@hookform/error-message";
import { RoomCat, RoomStatus } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import React from "react";
import { List } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { setRoomsMode } from "./roomsSlice";

const AddRoom: NextPage = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { errors: validationError },
  } = useForm<CreateRoomInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["room.create-room"],
    {
      onSuccess: () => {
        reset();
        clearErrors();
      },
    }
  );

  const roomCat = (Object.keys(RoomCat) as (keyof typeof RoomCat)[]).map(
    (enumKey) => {
      return { label: RoomCat[enumKey].toLowerCase(), value: RoomCat[enumKey] };
    }
  );

  const roomStatus = (
    Object.keys(RoomStatus) as (keyof typeof RoomStatus)[]
  ).map((enumKey) => {
    return {
      label: RoomStatus[enumKey].toLowerCase(),
      value: RoomStatus[enumKey],
    };
  });

  function onSubmit(values: CreateRoomInput) {
    mutate({ ...values });
  }
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add Room</h1>
        </div>
        <SecondaryButton
          className="w-11"
          onClick={() => dispatch(setRoomsMode({ mode: "View" }))}
        >
          <List size={24} />
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
          <span className="font-medium">Success alert!</span> Room Added
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="col-span-1 space-y-3">
            <GenericInput
              label="Floor"
              type="text"
              placeHolder="Floor"
              required
              register={register("floor")}
            />
            <GenericInput
              label="Room No"
              type="text"
              placeHolder="Room No"
              required
              register={register("roomNo")}
            />
            <GenericInput
              label="Station"
              type="text"
              placeHolder="Station"
              required
              register={register("station")}
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
            <ErrorMessage
              errors={validationError}
              name="price"
              render={() => (
                <p className="text-red-500 bg-red-100 p-2 text-sm font-bold">
                  Max Value Exceeded
                </p>
              )}
            />
          </div>

          <div className="col-span-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Room Category
              </label>
              <Controller
                control={control}
                defaultValue={RoomCat["WARD" as keyof typeof RoomCat]}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <Select
                    classNamePrefix="addl-class"
                    options={roomCat}
                    value={roomCat.find((c) => c.value === value)}
                    onChange={(category) => onChange(category?.value)}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Room Status
              </label>
              <Controller
                control={control}
                defaultValue={RoomStatus["VACANT" as keyof typeof RoomStatus]}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <Select
                    classNamePrefix="addl-class"
                    options={roomStatus}
                    value={roomStatus.find((c) => c.value === value)}
                    onChange={(status) => onChange(status?.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="py-3 text-right">
            <PrimaryButton
              className="w-1/3"
              isLoading={isLoading}
              type="submit"
            >
              Add
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
