import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import LinearLoading from "@/components/LinearLoading";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import React, { useState } from "react";
import { Edit, PlusSquare, Trash2 } from "react-feather";
import { setRoomsMode } from "./roomsSlice";

const ViewRoom: NextPage = () => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, isRefetching, refetch } = trpc.useQuery(
    [
      "room.get-rooms",
      {
        searchInput: searchInput,
      },
    ],
    { enabled: true }
  );
  const { mutate } = trpc.useMutation(["room.delete-room"], {
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
    if (window.confirm("Are you sure to Delete this Room")) {
      mutate({ id: id });
    }
  };
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        </div>
        <div className="flex flex-row gap-5">
          <div>
            <SearchInput
              placeholder="Search a Name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <SecondaryButton
            className="w-11"
            onClick={() => dispatch(setRoomsMode({ mode: "Add" }))}
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
              room No
            </th>
            <th scope="col" className="py-3 px-6">
              floor
            </th>
            <th scope="col" className="py-3 px-6">
              station
            </th>
            <th scope="col" className="py-3 px-6">
              category
            </th>
            <th scope="col" className="py-3 px-6">
              price
            </th>
            <th scope="col" className="py-3 px-6">
              status
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((room, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                  >
                    {room.roomNo}
                  </th>
                  <td className="py-4 px-6">{room.floor}</td>
                  <td className="py-4 px-6">{room.station}</td>
                  <td className="py-4 px-6 capitalize">{room.category}</td>
                  <td className="py-4 px-6">{room.price?.toString()}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-bold p-2 rounded-full w-full
                    ${
                      room.status === "VACANT" && "text-green-900 bg-green-50  "
                    }
                    ${
                      room.status === "OCCUPIED" &&
                      "text-yellow-900 bg-yellow-50"
                    }
                    ${
                      room.status === "OUT_OF_SERVICE" &&
                      "text-red-900 bg-red-50"
                    }
                    `}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-5">
                    <span
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        dispatch(setRoomsMode({ mode: "Edit", room: room }))
                      }
                    >
                      <Edit size={20} />
                    </span>

                    <span
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                      onClick={() => deleteDialog({ id: room.id })}
                    >
                      <Trash2 size={20} />
                    </span>
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
