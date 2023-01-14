import { useAppDispatch } from "@/app/hook";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import LinearLoading from "@/components/LinearLoading";
import useDebounce from "@/hooks/useDebounce";
import { SearchPatientInput } from "@/schema/patient.schema";
import { trpc } from "@/utils/trpc";
import { Tooltip } from "@mui/material";
import { MedicalRecord, Patient } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";
import { FilePlus, FileText, PlusSquare, Trash2 } from "react-feather";
import Select from "react-select";
import { setPatientsMode, togglePatientAdmit } from "./patientsSlice";

const ViewPatient: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: sessionData } = useSession();

  const [patientData, setPatientData] = useState<
    (Patient & {
      medicalRecord: MedicalRecord[];
    })[]
  >();
  const [filter, setFilter] = useState<boolean>(true);
  const [name, setName] = useState<SearchPatientInput>({ name: undefined });

  const debouncedValue = useDebounce<SearchPatientInput>(name, 500);
  const { data, isLoading, isRefetching, error } = trpc.useQuery(
    [
      "patient.all-patients",
      {
        ...debouncedValue,
      },
    ],
    {
      enabled: true,
      onSuccess: (data) => {
        setPatientData(data);
      },
    }
  );

  const { mutate } = trpc.useMutation(["patient.delete-patient"], {
    onMutate: (variables) => {
      setPatientData((prev) =>
        prev?.filter((patient) => patient.id !== variables.id)
      );
    },
  });

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const isNurse = router.pathname.includes("nurse");

  const filterData = patientData?.filter(
    (patient) => patient.isAdmitted === filter
  );

  const viewPatient = ({ patient }: { patient: Patient }) => {
    router.push({
      pathname: "nurse/patient/[patient]",
      query: { patient: patient.id },
    });
  };
  const viewRecord = ({ id }: { id: number }) => {
    router.push({
      pathname: "nurse/patient/record/[record]",
      query: { record: id },
    });
  };

  const isAdmin = sessionData?.user?.role === "ADMIN";

  const deleteDialog = ({ patient }: { patient: Patient }) => {
    if (window.confirm("Are you sure to Delete this Patient Data?")) {
      mutate({ ...patient });
    }
  };

  return (
    <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <div>
            <Select
              className="w-40"
              defaultValue={{ label: "Admitted" }}
              options={[{ label: "Admitted" }, { label: "Discharged" }]}
              value={filter ? { label: "Admitted" } : { label: "Discharged" }}
              onChange={(newValue) => {
                setFilter(newValue?.label === "Admitted" ? true : false);
              }}
            />
          </div>
          <div>
            <SearchInput
              placeholder="Search a Name"
              value={name.name}
              onChange={(e) => setName({ name: e.target.value })}
            />
          </div>
          {isNurse ? (
            <SecondaryButton
              className="w-auto gap-3"
              onClick={() => dispatch(setPatientsMode({ mode: "Add" }))}
            >
              <PlusSquare size={24} />
              <span className="text-base">Add</span>
            </SecondaryButton>
          ) : null}
        </div>
      </div>
      {error && (
        <div
          className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Error alert! </span>
          {error && error.message}
        </div>
      )}
      <LinearLoading isLoading={isLoading || isRefetching} />
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
            <th scope="col" className="py-3 px-1">
              Action
            </th>
          </tr>
        </thead>
        <Suspense>
          <tbody>
            {filterData?.map((patient, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className={`py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize cursor-pointer hover:underline`}
                    onClick={() => {
                      viewPatient({ patient });
                    }}
                  >
                    <Tooltip title="View patient data" arrow>
                      <>
                        {patient?.lastName}, {patient?.firstName}{" "}
                        {patient?.middleName}
                      </>
                    </Tooltip>
                  </th>
                  <td className="py-4 px-6">{patient.gender}</td>
                  <td className="py-4 px-6">
                    {patient.birthday?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 text-ellipsis max-w-xs overflow-hidden">
                    {patient.address}
                  </td>
                  <td className="py-4 px-6">{patient.mobile}</td>
                  <td className="py-4 px-6">{patient.bloodType}</td>
                  <td className="py-4 px-6 flex gap-2">
                    {!patient.isAdmitted && isAdmin ? (
                      <>
                        <Tooltip title="Delete Record" arrow>
                          <Trash2
                            className="text-red-500 cursor-pointer"
                            size={24}
                            onClick={() => {
                              deleteDialog({ patient });
                            }}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        {!patient.isAdmitted ? (
                          <Tooltip title="Admit patient" arrow>
                            <FilePlus
                              className="text-blue-500 cursor-pointer"
                              size={24}
                              onClick={() => {
                                viewPatient({ patient });
                                dispatch(togglePatientAdmit());
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="View Patient Record" arrow>
                              <FileText
                                className="text-blue-500 cursor-pointer"
                                size={20}
                                onClick={() => {
                                  if (patient.medicalRecord.at(-1)) {
                                    viewRecord({
                                      id: patient.medicalRecord.at(-1)
                                        ?.id as number,
                                    });
                                  } else {
                                    viewPatient({ patient });
                                  }
                                }}
                              />
                            </Tooltip>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {!data && !error && !isLoading ? <>No Patient Data</> : null}
          </tbody>
        </Suspense>
      </table>
    </div>
  );
};

export default ViewPatient;
