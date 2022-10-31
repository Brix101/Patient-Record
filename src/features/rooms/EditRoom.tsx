import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { UpdateRoomInput } from "@/schema/room.schema";
import { trpc } from "@/utils/trpc";
import { ErrorMessage } from "@hookform/error-message";
import { RoomCat, RoomStatus } from "@prisma/client";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { roomsState, setRoomsMode } from "./roomsSlice";

const EditRoom: NextPage = () => {
  const dispatch = useAppDispatch();
  const { room } = useAppSelector(roomsState);
  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { errors: validationError, isDirty },
  } = useForm<UpdateRoomInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["room.update-user"],
    {
      onSuccess: () => {
        clearErrors();
        console.log("success");
        dispatch(setRoomsMode({ mode: "View" }));
      },
    }
  );

  useEffect(() => {
    if (room) {
      reset({
        id: room.id,
        category: room.category,
        floor: room.floor as string,
        price: room.price as unknown as number,
        roomNo: room.roomNo as string,
        station: room.station as string,
        status: room.status,
      });
    }
  }, [room, reset]);

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
  function onSubmit(values: UpdateRoomInput) {
    mutate({ ...values });
  }
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className=" w-full h-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Edit Room Info</h1>
          </div>
          <div>
            <OutlinedButton
              onClick={() => dispatch(setRoomsMode({ mode: "View" }))}
            >
              <XSquare size={24} />
            </OutlinedButton>
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
            <span className="font-medium">Success alert!</span> Room Added
          </div>
        )}
      </div>
      {room && (
        <form
          className="flex-1 flex flex-col items-center mt-5 mb-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full max-w-md">
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
          <div className="w-full max-w-md my-5 flex justify-end">
            <div className="py-3 text-right flex gap-2 justify-end">
              <PrimaryButton
                className="w-full min-w-[150px]"
                isLoading={isLoading}
                disabled={!isDirty}
                type="submit"
              >
                Update
              </PrimaryButton>

              <OutlinedButton
                type="button"
                onClick={() => dispatch(setRoomsMode({ mode: "View" }))}
              >
                Cancel
              </OutlinedButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditRoom;
