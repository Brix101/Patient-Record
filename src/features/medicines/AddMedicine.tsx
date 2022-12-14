import { useAppDispatch } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { CreateMedicineInput } from "@/schema/medicine.schema";
import { Unit } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import React from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { setMedicinesMode } from "./medicinesSlice";

const AddMedicine: NextPage = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { isDirty },
  } = useForm<CreateMedicineInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["medicine.create-medicine"],
    {
      onSuccess: () => {
        reset();
        clearErrors();
        dispatch(setMedicinesMode({ mode: "View" }));
      },
    }
  );

  const units = (Object.keys(Unit) as (keyof typeof Unit)[]).map((enumKey) => {
    return { label: Unit[enumKey].toLowerCase(), value: Unit[enumKey] };
  });

  function onSubmit(values: CreateMedicineInput) {
    mutate({ ...values });
  }

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add Medicine</h1>
        </div>
        <SecondaryButton
          className="w-11"
          onClick={() => dispatch(setMedicinesMode({ mode: "View" }))}
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
          <span className="font-medium">Success alert!</span> Medicine Added
        </div>
      )}
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
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Unit
              </label>
              <Controller
                control={control}
                defaultValue={Unit["g" as keyof typeof Unit]}
                name="unit"
                render={({ field: { onChange, value } }) => (
                  <Select
                    classNamePrefix="addl-class"
                    options={units}
                    value={units.find((c) => c.value === value)}
                    onChange={(unit) => onChange(unit?.value)}
                  />
                )}
              />
            </div>
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
              isLoading={isLoading}
              disabled={!isDirty}
              type="submit"
            >
              Add
            </PrimaryButton>

            <OutlinedButton
              type="button"
              onClick={() => dispatch(setMedicinesMode({ mode: "View" }))}
            >
              Cancel
            </OutlinedButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;
