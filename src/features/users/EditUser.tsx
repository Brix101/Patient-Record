import { useAppDispatch, useAppSelector } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GenericInput from "@/components/inputs/GenericInput";
import PhysicianInput from "@/components/inputs/PhysicianInput";
import { UpdateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { setUsersMode, usersState } from "@features/users/usersSlice";
import { Role } from "@prisma/client";
import { NextPage } from "next";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { XSquare } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const EditUser: NextPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(usersState);
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
        dispatch(setUsersMode({ mode: "View" }));
      },
    }
  );

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        email: user.email as string,
        mobile: user.mobile as string,
        address: user.address as string,
        licenseNumber: user?.Physician?.licenseNumber,
        expertise: user?.Physician?.expertise,
        role: user?.role,
        gender: user?.gender as string,
        image: user?.image as string,
        birthday: user.birthday as Date,
      });
    }
  }, [user, reset]);

  const userRoles = (Object.keys(Role) as (keyof typeof Role)[]).map(
    (enumKey) => {
      return {
        label: Role[enumKey].toLowerCase(),
        value: Role[enumKey],
      };
    }
  );
  const genderOptions = [
    { label: "male", value: "MALE" },
    { label: "female", value: "FEMALE" },
  ];

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
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className=" w-full h-full">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit User Information
            </h1>
          </div>
          <div>
            <OutlinedButton
              onClick={() => dispatch(setUsersMode({ mode: "View" }))}
            >
              <XSquare size={24} />
            </OutlinedButton>
          </div>
        </div>
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
        {user && (
          <form
            className="flex-1 flex flex-col items-center mt-5 mb-20"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full max-w-md">
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
                      defaultValue={user?.gender ? user?.gender : "MALE"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    User Role
                  </label>
                  <Controller
                    control={control}
                    defaultValue={Role[user?.role as keyof typeof Role]}
                    name="role"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        classNamePrefix="addl-class"
                        options={userRoles}
                        value={userRoles.find((c) => c.value === value)}
                        onChange={(role) => onChange(role?.value)}
                      />
                    )}
                  />
                </div>
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
                    <PhysicianInput
                      enable={getValues("role") === "PHYSICIAN"}
                      placeHolder="Session Charge"
                      label="Session Charge"
                      register={register("sessionCharge", {
                        valueAsNumber: true,
                        validate: (value) => (value as number) > 0,
                        max: 999999999,
                      })}
                    />
                  </>
                ) : null}
              </div>
            </div>
            <div className="w-full max-w-md my-5 flex justify-end">
              <div className="py-3 text-right flex gap-2 justify-end">
                <PrimaryButton
                  className="w-full min-w-[150px]"
                  isLoading={isLoading}
                  type="submit"
                  disabled={!isDirty}
                >
                  Update
                </PrimaryButton>

                <OutlinedButton
                  type="button"
                  onClick={() => dispatch(setUsersMode({ mode: "View" }))}
                >
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
