import { useAppDispatch } from "@/app/hook";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { setUsersMode } from "@features/users/usersSlice";
import { Role } from "@prisma/client";
import { CreateUserInput } from "@schema/user.schema";
import { trpc } from "@utils/trpc";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { List } from "react-feather";
import { useForm } from "react-hook-form";

function AddUser() {
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [isPhysician, setPhysician] = useState(false);
  const { handleSubmit, register, reset } = useForm<CreateUserInput>();
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
      return (
        <>
          <option value={Role[enumKey]}>{Role[enumKey]}</option>
        </>
      );
    }
  );

  function onSubmit(values: CreateUserInput) {
    const physician = !isPhysician && { expertes: "", licenseNUmber: "" };
    mutate({
      ...values,
      image: "/user.svg",
      birthday: startDate,
      ...physician,
    });
  }

  return (
    <>
      <div className="shadow sm:overflow-hidden sm:rounded-md  p-5 mx-5">
        <div className="h-20 w-full flex items-start justify-end pt-2 px-5">
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
        <form
          className="md:grid md:grid-cols-2 md:gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="col-span-1 space-y-3">
            <div className="grid grid-cols-2 gap-2 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  placeholder="First Name"
                  {...register("firstName")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  placeholder="Last Name"
                  {...register("lastName")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <div>
                <label className="bloc text-sm font-medium text-gray-900 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  placeholder="john.doe@example.com"
                  {...register("email")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Mobile Number
                </label>
                <input
                  type="text"
                  autoComplete="mobile"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  placeholder="Mobile"
                  {...register("mobile")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  {...register("gender")}
                >
                  <option value="" selected disabled hidden>
                    Gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Birthdate
                </label>
                <DatePicker
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Address"
                {...register("address")}
              />
            </div>
          </div>
          <div className="col-span-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                User Role
              </label>
              <select
                id="role"
                className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                {...register("role")}
                onChange={(e) => setPhysician(e.target.value === "PHYSICIAN")}
              >
                <option value="" selected disabled hidden>
                  User Role
                </option>
                {userRoles}
              </select>
            </div>
            <>
              <div>
                <label
                  className={`block text-sm font-medium  dark:text-gray-300 ${
                    isPhysician ? "text-gray-900" : "text-gray-200"
                  }`}
                >
                  License NUmber
                </label>
                <input
                  type="text"
                  required
                  className={`border ${
                    isPhysician
                      ? "bg-gray-50 border-gray-300"
                      : "bg-white border border-gray-100 placeholder:text-gray-200"
                  } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`}
                  placeholder="License Number"
                  {...register("licenseNUmber")}
                  disabled={!isPhysician}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium  dark:text-gray-300 ${
                    isPhysician ? "text-gray-900" : "text-gray-200"
                  }`}
                >
                  Expertise
                </label>
                <input
                  type="text"
                  required
                  className={`border ${
                    isPhysician
                      ? "bg-gray-50 border-gray-300"
                      : "bg-white border border-gray-100 placeholder:text-gray-200"
                  } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`}
                  placeholder="Expertise"
                  {...register("expertes")}
                  disabled={!isPhysician}
                />
              </div>
            </>
            <div className="py-3 text-right">
              <PrimaryButton
                className="w-1/2"
                isLoading={isLoading}
                isSuccess={isSuccess}
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
}

export default AddUser;
