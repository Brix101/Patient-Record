import { Physician, User } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Edit } from "react-feather";
import { trpc } from "../../../utils/trpc";
import LinearLoading from "../../LinearLoading";
import EditUser from "./EditUser";

function Users({
  addMode,
  setAddMode,
}: {
  addMode: boolean;
  setAddMode: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState<
    (User & { Physician: Physician[] }) | undefined
  >();

  const { data, isLoading } = trpc.useQuery(
    [
      "users.all-users",
      {
        name: name,
      },
    ],
    { enabled: true }
  );

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  return (
    <>
      <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
        {editMode ? (
          <EditUser editMode={editMode} setEditMode={setEditMode} />
        ) : (
          <>
            <div className="h-20 w-full flex flex-row items-start justify-between pt-2 px-5">
              <div>
                <div className="flex items-center w-full">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      placeholder="Search Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-transparent bg-blue-600 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setAddMode(!addMode)}
              >
                Add User
              </button>
            </div>
            {isLoading ? (
              <LinearLoading />
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Email
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Role
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Account Status
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((user, i) => {
                      return (
                        <tr key={i} className={`${TableStyle(i)}`}>
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                          >
                            {user.lastName}, {user.firstName}
                          </th>
                          <td className="py-4 px-6">{user.email}</td>
                          <td className="py-4 px-6 capitalize">{user.role}</td>
                          <td className="py-4 px-6">
                            {user.disabled ? (
                              <div
                                className="px-4 py-2 w-fit text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
                                role="alert"
                              >
                                <span className="font-medium">Disabled</span>
                              </div>
                            ) : (
                              <div
                                className="px-4 py-2 w-fit text-sm text-teal-700 bg-teal-100 rounded-full dark:bg-teal-200 dark:text-teal-800"
                                role="alert"
                              >
                                <span className="font-medium">Active</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                              onClick={() => setEditMode(user)}
                            >
                              <Edit size={20} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Users;
