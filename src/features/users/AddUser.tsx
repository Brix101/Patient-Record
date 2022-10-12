import { useAppDispatch } from "@/app/hook";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GenericInput from "@components/inputs/GenericInput";
import PhysicianInput from "@components/inputs/PhysicianInput";
import { setUsersMode } from "@features/users/usersSlice";
import { Role } from "@prisma/client";
import { CreateUserInput } from "@schema/user.schema";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { List } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const AddUser: NextPage = () => {
  const dispatch = useAppDispatch();
  const [isPhysician, setPhysician] = useState(false);
  const { handleSubmit, register, reset, control } = useForm<CreateUserInput>();
  const { mutate, error, isLoading, isSuccess } = trpc.useMutation(
    ["users.register-user"],
    {
      onSuccess: () => {
        reset();
        setPhysician(false);
      },
    }
  );

  const userRoles = (Object.keys(Role) as (keyof typeof Role)[]).map(
    (enumKey) => {
      return {
        label: Role[enumKey].toLowerCase(),
        value: Role[enumKey],
      };
    }
  );
  const genderOptions = [
    { label: "Prefer not to respond", value: "NO_RESPOND" },
    { label: "male", value: "MALE" },
    { label: "female", value: "FEMALE" },
  ];

  function onSubmit(values: CreateUserInput) {
    const physician = !isPhysician && { expertise: "", licenseNumber: "" };
    mutate({
      ...values,
      image: `/${values.gender.toLowerCase()}_pic.svg`,
      ...physician,
    });
  }

  return (
    <>
      <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
        <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Add User</h1>
          </div>
          <SecondaryButton
            className="w-11"
            onClick={() => dispatch(setUsersMode({ mode: "View" }))}
          >
            <List size={24} />
          </SecondaryButton>
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
            <span className="font-medium">Success alert!</span> User Added
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    defaultValue={"NO_RESPOND"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Birthdate
                  </label>
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field }) => (
                      <DatePicker
                        className="block w-full h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
                        placeholderText="Select date (MMMM-dd-yyyy)"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat="MMMM-dd-yyyy"
                        required
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
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  User Role
                </label>
                <Controller
                  control={control}
                  defaultValue={Role["NURSE" as keyof typeof Role]}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      classNamePrefix="addl-class"
                      options={userRoles}
                      value={userRoles.find((c) => c.value === value)}
                      onChange={(role) => {
                        onChange(role?.value);
                        if (role?.value === "PHYSICIAN") {
                          setPhysician(true);
                        } else {
                          setPhysician(false);
                        }
                      }}
                    />
                  )}
                />
              </div>
              <>
                <PhysicianInput
                  enable={isPhysician}
                  placeHolder="License Number"
                  label="License Number"
                  register={register("licenseNumber")}
                />
                <PhysicianInput
                  enable={isPhysician}
                  placeHolder="Expertise"
                  label="Expertise"
                  register={register("expertise")}
                />
              </>
            </div>
          </div>
          <div className="w-full">
            <div className="py-3 text-right">
              <PrimaryButton
                className="w-1/3"
                isLoading={isLoading}
                type="submit"
              >
                Register
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
