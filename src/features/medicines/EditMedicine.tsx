import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { UpdateMedicineInput } from "@/schema/medicine.schema";
import { trpc } from "@/utils/trpc";
import { Unit } from "@prisma/client";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { medicinesState, setMedicinesMode } from "./medicinesSlice";

const EditMedicine: NextPage = () => {
  const dispatch = useAppDispatch();
  const { medicine } = useAppSelector(medicinesState);
  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { isDirty },
  } = useForm<UpdateMedicineInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["medicine.update-medicine"],
    {
      onSuccess: () => {
        clearErrors();
        console.log("success");
      },
    }
  );

  useEffect(() => {
    if (medicine) {
      reset({
        id: medicine?.id,
        name: medicine?.name as string,
        quantity: medicine?.quantity as number,
        price: medicine?.price as unknown as number,
        unit: medicine?.unit,
      });
    }
  }, [medicine, reset]);

  const units = (Object.keys(Unit) as (keyof typeof Unit)[]).map((enumKey) => {
    return { label: Unit[enumKey].toLowerCase(), value: Unit[enumKey] };
  });

  function onSubmit(values: UpdateMedicineInput) {
    mutate({ ...values });
  }
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className=" w-full h-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Medicine Information
            </h1>
          </div>
          <div>
            <div>
              <OutlinedButton
                onClick={() => dispatch(setMedicinesMode({ mode: "View" }))}
              >
                <XSquare size={24} />
              </OutlinedButton>
            </div>
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
            <span className="font-medium">Success alert!</span> Medicine Added
          </div>
        )}
      </div>
      {medicine && (
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
                Update
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
      )}
    </div>
  );
};

export default EditMedicine;
