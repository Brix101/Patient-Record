import { useAppDispatch } from "@/app/hook";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { setUsersMode } from "@features/users/usersSlice";
import React from "react";
import { Edit, XSquare } from "react-feather";

function EditUser() {
  const dispatch = useAppDispatch();
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="bg-white w-full h-full">
        <div className="h-20 w-full flex items-start justify-end pt-2 px-5 gap-5">
          <OutlinedButton
            onClick={() => dispatch(setUsersMode({ mode: "View" }))}
          >
            <XSquare size={24} />
          </OutlinedButton>
          <PrimaryButton>
            <Edit size={24} />
          </PrimaryButton>
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
    </div>
  );
}

export default EditUser;
