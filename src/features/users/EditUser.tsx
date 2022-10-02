import { Physician, User } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";

function EditUser({
  editMode,
  setEditMode,
}: {
  editMode: (User & { Physician: Physician[] }) | undefined;
  setEditMode: Dispatch<
    SetStateAction<
      | (User & {
          Physician: Physician[];
        })
      | undefined
    >
  >;
}) {
  const user = editMode;

  return (
    <div className="bg-white w-full h-full">
      <div className="h-20 w-full flex items-start justify-end pt-2 px-5 gap-5">
        <button
          type="button"
          className="rounded-lg border border-gray-600 bg-slate-50 py-2.5 px-5 text-sm font-medium text-black shadow-sm hover:bg-slate-100 "
          onClick={() => setEditMode(undefined)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg border border-transparent bg-green-600 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Update User
        </button>
      </div>
      <form className="md:grid md:grid-cols-2 md:gap-6">
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
          </div>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Gender
              </label>
              <select
                id="gender"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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
              {/* <DatePicker
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                /> */}
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
            />
          </div>
        </div>
        <div className="col-span-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              User Role
            </label>
            {/* <select
              id="role"
              className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            >
              <option value="" selected disabled hidden>
                User Role
              </option>
            </select> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditUser;