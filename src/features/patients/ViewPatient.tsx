import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import LinearLoading from "@/components/LinearLoading";
import useDebounce from "@/hooks/useDebounce";
import { SearchPatientInput } from "@/schema/patient.schema";
import { trpc } from "@/utils/trpc";
import { Patient } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Clipboard, Edit, PlusSquare, Trash2 } from "react-feather";
import { setPatientsMode } from "./patientsSlice";

const ViewPatient: NextPage = () => {
  const dispatch = useAppDispatch();
  const { data: sessionData } = useSession();
  const [patientsData, setPatientsData] = useState<Patient[] | undefined>([]);
  const [name, setName] = useState<SearchPatientInput>({ name: undefined });

  const debouncedValue = useDebounce<SearchPatientInput>(name, 500);
  const { data, isLoading, isRefetching, refetch } = trpc.useQuery(
    [
      "patient.all-patients",
      {
        ...debouncedValue,
      },
    ],
    { enabled: true }
  );

  const { mutate, isLoading: isDeleteLoading } = trpc.useMutation(
    ["patient.delete-patient"],
    {
      onMutate: (variables) => {
        setPatientsData((prev) => prev?.filter((items) => items !== variables));
      },
      onSuccess: () => {
        refetch();
      },
    }
  );

  useEffect(() => {
    if (data) {
      setPatientsData(data);
    }
  }, [data]);

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const deleteDialog = ({ patient }: { patient: Patient }) => {
    if (window.confirm("Are you sure to Delete this Patient Data?")) {
      mutate({ ...patient });
    }
  };

  return (
    <div className="relative w-full shadow-md mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        </div>
        <div className="flex flex-row gap-5">
          <div>
            <SearchInput
              placeholder="Search a Name"
              value={name.name}
              onChange={(e) => setName({ name: e.target.value })}
            />
          </div>
          <SecondaryButton
            className="w-11"
            onClick={() => dispatch(setPatientsMode({ mode: "Add" }))}
          >
            <PlusSquare size={24} />
          </SecondaryButton>
        </div>
      </div>
      <LinearLoading isLoading={isLoading || isRefetching || isDeleteLoading} />
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 select-none">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Patient Name
            </th>
            <th scope="col" className="py-3 px-3">
              gender
            </th>
            <th scope="col" className="py-3 px-8">
              Birthday
            </th>
            <th scope="col" className="py-3 px-6">
              Address
            </th>
            <th scope="col" className="py-3 px-4">
              Contact No.
            </th>
            <th scope="col" className="py-3 px-2">
              Blood type
            </th>
            <th scope="col" className="py-3 px-6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patientsData?.map((patient, i) => {
            return (
              <tr key={i} className={`${TableStyle(i)}`}>
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                >
                  {patient.lastName && patient.lastName},{" "}
                  {patient.firstName && patient.firstName}
                </th>
                <td className="py-4 px-6">{patient.gender}</td>
                <td className="py-4 px-6">
                  {patient.birthday?.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-6">{patient.address}</td>
                <td className="py-4 px-6">{patient.mobile}</td>
                <td className="py-4 px-6">{patient.bloodType}</td>
                <td className="py-4 px-6 flex gap-5">
                  <span className="font-medium text-green-600 dark:text-green-500 hover:underline cursor-pointer">
                    <Clipboard size={20} />
                  </span>
                  <span
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() =>
                      dispatch(
                        setPatientsMode({ mode: "Edit", patient: patient })
                      )
                    }
                  >
                    <Edit size={20} />
                  </span>
                  {sessionData?.user?.role === "ADMIN" ? (
                    <span
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                      onClick={() => deleteDialog({ patient })}
                    >
                      <Trash2 size={20} />
                    </span>
                  ) : null}
                </td>
              </tr>
            );
          })}
          {!data && !isLoading ? <>No Rooms Data</> : null}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPatient;
