import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import { SearchUserInput } from "@/schema/user.schema";
import LinearLoading from "@components/LinearLoading";
import { setUsersMode } from "@features/users/usersSlice";
import { Role } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Edit, Trash2, UserPlus } from "react-feather";
import Select from "react-select";

const ViewUsers: NextPage = () => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState<SearchUserInput>({
    name: "",
    role: null,
  });

  const debouncedValue = useDebounce<SearchUserInput>(searchInput, 500);
  const { data, isLoading, isRefetching, refetch, isFetching } = trpc.useQuery(
    [
      "users.all-users",
      {
        ...debouncedValue,
      },
    ],
    { enabled: true }
  );

  const { mutate, isLoading: isDeleteLoading } = trpc.useMutation(
    ["users.delete-user"],
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const deleteDialog = ({ id }: { id: number }) => {
    if (window.confirm("Are you sure to Delete this User")) {
      mutate({ id: id });
    }
  };

  const userRoles = (Object.keys(Role) as (keyof typeof Role)[]).map(
    (enumKey) => {
      return {
        label: Role[enumKey].toLowerCase(),
        value: Role[enumKey],
      };
    }
  );

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        </div>
        <div className="flex flex-row gap-5">
          <div className="flex items-center">
            <Select
              className="w-40"
              defaultValue={{ label: "All" }}
              options={[{ label: "All" }, ...userRoles]}
              onChange={(role) => {
                const isValid = userRoles.find((userRole) => userRole === role);
                if (isValid) {
                  setSearchInput({ ...searchInput, role: isValid.value });
                } else {
                  setSearchInput({ ...searchInput, role: null });
                }
              }}
            />
          </div>
          <div>
            <SearchInput
              placeholder="Search a Name"
              value={searchInput.name}
              onChange={(e) =>
                setSearchInput({ ...searchInput, name: e.target.value })
              }
            />
          </div>
          <SecondaryButton
            className="w-11"
            onClick={() => dispatch(setUsersMode({ mode: "Add" }))}
          >
            <UserPlus size={24} />
          </SecondaryButton>
        </div>
      </div>
      <LinearLoading
        isLoading={isLoading || isRefetching || isFetching || isDeleteLoading}
      />
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
              Mobile
            </th>
            <th scope="col" className="py-3 px-6">
              Role
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
                    {user.lastName && user.lastName},{" "}
                    {user.firstName && user.firstName}
                  </th>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.mobile}</td>
                  <td className="py-4 px-6 capitalize">{user.role}</td>
                  <td className="py-4 px-6 flex gap-5">
                    <span
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        dispatch(setUsersMode({ mode: "Edit", user: user }))
                      }
                    >
                      <Edit size={20} />
                    </span>

                    <span
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                      onClick={() => deleteDialog({ id: user.id })}
                    >
                      <Trash2 size={20} />
                    </span>
                  </td>
                </tr>
              );
            })}

          {!data && <>No Users Data</>}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;
