import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import LinearLoading from "@/components/LinearLoading";
import { Role } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Edit, PlusSquare, Trash2 } from "react-feather";
import { setMedicinesMode } from "./medicinesSlice";

const ViewRoom: NextPage = () => {
  const { data: userData } = useSession();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const { data, isLoading, isRefetching, refetch } = trpc.useQuery(
    [
      "medicine.get-medecines",
      {
        name: name,
      },
    ],
    { enabled: true }
  );
  const { mutate } = trpc.useMutation(["medicine.delete-medicine"], {
    onSuccess: () => {
      refetch();
    },
  });

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const deleteDialog = ({ id }: { id: number }) => {
    if (window.confirm("Are you sure to Delete this Medicine")) {
      mutate({ id: id });
    }
  };
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
        </div>
        <div className="flex flex-row gap-5">
          <div>
            <SearchInput
              placeholder="Search a Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <SecondaryButton
            className="w-11"
            onClick={() => dispatch(setMedicinesMode({ mode: "Add" }))}
          >
            <PlusSquare size={24} />
          </SecondaryButton>
        </div>
      </div>
      <LinearLoading isLoading={isLoading || isRefetching} />
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Quantity
            </th>
            <th scope="col" className="py-3 px-6">
              Unit
            </th>
            <th scope="col" className="py-3 px-6">
              price
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((medicine, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                  >
                    {medicine.name}
                  </th>
                  <td className="py-4 px-6">{medicine.quantity}</td>
                  <td className="py-4 px-6">{medicine.unit}</td>
                  <td className="py-4 px-6">{medicine.price?.toString()}</td>
                  <td className="py-4 px-6 flex gap-5">
                    <span
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        dispatch(
                          setMedicinesMode({ mode: "Edit", medicine: medicine })
                        )
                      }
                    >
                      <Edit size={20} />
                    </span>
                    {userData && userData.user?.role === Role.ADMIN && (
                      <span
                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                        onClick={() => deleteDialog({ id: medicine.id })}
                      >
                        <Trash2 size={20} />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRoom;
