import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import { UpdateMedicineInput } from "@/schema/medicine.schema";
import { trpc } from "@/utils/trpc";
import { ErrorMessage } from "@hookform/error-message";
import { Unit } from "@prisma/client";
import React, { useEffect } from "react";
import { XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { medicinesState, setMedicinesMode } from "./medicinesSlice";

function EditMedicine() {
  const dispatch = useAppDispatch();
  const { medicine } = useAppSelector(medicinesState);
  const {
    handleSubmit,
    register,
    reset,
    control,
    clearErrors,
    formState: { errors: validationError },
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
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          </div>
          <OutlinedButton
            onClick={() => dispatch(setMedicinesMode({ mode: "View" }))}
          >
            <XSquare size={24} />
          </OutlinedButton>
        </div>
        {(!isSuccess || error || validationError) && (
          <div
            className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <span className="font-medium">Error alert! </span>
            {error && error.message}
            <ErrorMessage
              errors={validationError}
              name="price"
              render={({ message }) => <p> Max Value Exceeded</p>}
            />
          </div>
        )}
        {isSuccess ||
          !error ||
          (!validationError && (
            <div
              className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
              role="alert"
            >
              <span className="font-medium">Success alert!</span> Medicine Added
            </div>
          ))}
      </div>
      {medicine && (
        <form
          className="md:grid md:grid-cols-2 md:gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                defaultValue={Unit["kg" as keyof typeof Unit]}
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
          <div className="py-3 text-right">
            <PrimaryButton
              className="w-1/2"
              isLoading={isLoading}
              type="submit"
            >
              Add
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditMedicine;
