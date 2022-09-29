import { Role } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function AddUser() {
  const [startDate, setStartDate] = useState(new Date());
  const [isPhysician, setPhysician] = useState(false);
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error, isLoading } = trpc.useMutation(
    ["users.register-user"],
    {
      onSuccess: () => {
        console.log("register");
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
  if (error) {
    console.log(error);
  }

  if (isLoading) {
    console.log("Loading ...............");
  }

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <div className="shadow sm:overflow-hidden sm:rounded-md p-5 m-5">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="col-span-1">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a photo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <form className="m-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                {error && (
                  <div
                    className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    <span className="font-medium">{error.message}</span>
                  </div>
                )}
                <div className="rounded-md shadow-sm space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      placeholder="Name"
                      {...register("name")}
                    />
                  </div>
                  <div>
                    <label className="bloc text-sm font-medium text-gray-900 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md capitalize focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md capitalize focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md capitalize focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      User Role
                    </label>
                    <select
                      id="role"
                      className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 text-sm rounded-md capitalize focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      {...register("role")}
                      onChange={(e) =>
                        setPhysician(e.target.value === "PHYSICIAN")
                      }
                    >
                      <option value="" selected disabled hidden>
                        User Role
                      </option>
                      {userRoles}
                    </select>
                  </div>
                  {isPhysician && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                          License NUmber
                        </label>
                        <input
                          type="text"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                          placeholder="License NUmber"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                          Expertise
                        </label>
                        <input
                          type="text"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                          placeholder="Expertise"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-gray-50 py-3 text-right">
                  <button
                    type="submit"
                    className={
                      isLoading
                        ? "w-1/2  text-white bg-green-400 dark:bg-green-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        : "w-1/2  inline-flex justify-center rounded-lg border border-transparent bg-green-600 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        aria-hidden="true"
                        className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      <>Register</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUser;
