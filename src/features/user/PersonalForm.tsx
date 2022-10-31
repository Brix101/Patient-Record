import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import PhysicianInput from "@/components/inputs/PhysicianInput";
import { UpdateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const PersonalForm: NextPage = () => {
  const { data, isLoading: isUserLoading } = trpc.useQuery(["users.me"]);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isDirty },
    getValues,
  } = useForm<UpdateUserInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.update-user"],
    {
      onSuccess: () => {
        console.log("success");
      },
    }
  );

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        mobile: data.mobile as string,
        address: data.address as string,
        licenseNumber: data?.Physician?.licenseNumber,
        expertise: data?.Physician?.expertise,
        role: data?.role,
        gender: data?.gender as string,
        image: data?.image as string,
        birthday: data.birthday as Date,
      });
    }
  }, [data, reset]);

  const genderOptions = [
    { label: "male", value: "MALE" },
    { label: "female", value: "FEMALE" },
  ];

  if (isUserLoading) return <>Loading...</>;

  function onSubmit(values: UpdateUserInput) {
    const physician = values.role !== "PHYSICIAN" && {
      physicianId: 0,
      expertise: "",
      licenseNumber: "",
    };

    mutate({
      ...values,
      ...physician,
    });
  }
  return (
    <div className="relative mx-5 p-5  h-full">
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Error alert!</span>
          {error.message}
        </div>
      )}
      {isSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> User Updated
        </div>
      )}
      <form
        className="h-full flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="col-span-1 space-y-3">
            <div className="grid grid-cols-2 gap-2 items-end">
              <GenericInput
                label="First Name"
                type="text"
                placeHolder="First Name"
                required
                register={register("firstName")}
              />
              <GenericInput
                label="Last Name"
                type="text"
                placeHolder="Last Name"
                required
                register={register("lastName")}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <GenericInput
                label="Email"
                type="email"
                placeHolder="name@example.com"
                required
                register={register("email")}
              />
              <GenericInput
                label="Mobile Number"
                type="text"
                placeHolder="Mobile"
                required
                register={register("mobile")}
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
              <div className="z-50">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Birthdate
                </label>
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field }) => (
                    <DatePicker
                      className="block z-50 h-10 w-full rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
                      placeholderText="Select date"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value ? field.value : new Date()}
                      dateFormat="MMMM-dd-yyyy"
                    />
                  )}
                />
              </div>
            </div>
            <GenericInput
              label="Address"
              type="text"
              placeHolder="Address"
              required
              register={register("address")}
            />
          </div>
          <div className="col-span-1 space-y-3">
            {getValues("role") === "PHYSICIAN" ? (
              <>
                <PhysicianInput
                  enable={getValues("role") === "PHYSICIAN"}
                  placeHolder="License Number"
                  label="License Number"
                  register={register("licenseNumber")}
                />
                <PhysicianInput
                  enable={getValues("role") === "PHYSICIAN"}
                  placeHolder="Expertise"
                  label="Expertise"
                  register={register("expertise")}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="w-full">
          <div className="py-3 text-right">
            <PrimaryButton
              className="w-1/4"
              isLoading={isLoading}
              type="submit"
              disabled={!isDirty}
            >
              Update
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalForm;
