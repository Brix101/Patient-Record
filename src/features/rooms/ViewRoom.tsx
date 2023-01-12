import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import LinearLoading from "@/components/LinearLoading";
import SuspenseComponent from "@/components/SuspenseComponent";
import useDebounce from "@/hooks/useDebounce";
import { SearchRoomInput } from "@/schema/room.schema";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { NextPage } from "next";
import { Suspense, useEffect, useState } from "react";
import { Edit, PlusSquare, Trash2 } from "react-feather";
import { setRoomsMode } from "./roomsSlice";

const ViewRoom: NextPage = () => {
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState<number | undefined>();
  const [roomsData, setRoomsData] = useState<Room[] | undefined>([]);
  const [searchInput, setSearchInput] = useState<SearchRoomInput>({
    searchInput: undefined,
  });

  const debouncedValue = useDebounce<SearchRoomInput>(searchInput, 500);

  const { data, isLoading, isRefetching, refetch } = trpc.useQuery(
    [
      "room.get-rooms",
      {
        ...debouncedValue,
      },
    ],
    { enabled: true }
  );

  const { mutate, isLoading: isDeleteLoading } = trpc.useMutation(
    ["room.delete-room"],
    {
      onMutate: (variables) => {
        setIsActive(variables.id);
        setRoomsData((prev) => prev?.filter((items) => items !== variables));
      },
      onSuccess: () => {
        refetch();
        setIsActive(undefined);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setRoomsData(data);
    }
  }, [data]);

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const deleteDialog = ({ room }: { room: Room }) => {
    if (window.confirm("Are you sure to Delete this Room Data?")) {
      mutate({ ...room });
    }
  };
  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen w-full">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        </div>
        <div className="flex flex-row gap-5">
          <div>
            <SearchInput
              placeholder="Search Floor/Room no"
              value={searchInput.searchInput}
              onChange={(e) => setSearchInput({ searchInput: e.target.value })}
            />
          </div>
          <SecondaryButton
            className="w-auto gap-3"
            onClick={() => dispatch(setRoomsMode({ mode: "Add" }))}
          >
            <PlusSquare size={24} />
            <span className="text-base">Add</span>
          </SecondaryButton>
        </div>
      </div>
      <LinearLoading isLoading={isLoading || isRefetching || isDeleteLoading} />
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
        <Suspense>
          <tbody>
            {roomsData?.map((room, i) => {
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
                    <SuspenseComponent isLoading={isActive === room.id}>
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
                        onClick={() => deleteDialog({ room })}
                      >
                        <Trash2 size={20} />
                      </span>
                    </SuspenseComponent>
                  </td>
                </tr>
              );
            })}
            {!data && !isLoading ? <>No Rooms Data</> : null}
          </tbody>
        </Suspense>
      </table>
    </div>
  );
};

export default ViewRoom;
