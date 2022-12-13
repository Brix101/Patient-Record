import { useAppSelector } from "@/app/hook";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Suspense } from "react";
import { Eye } from "react-feather";
import { patientsState } from "./patientsSlice";

const PatientRecord: NextPage = () => {
  const router = useRouter();
  const { patient } = useAppSelector(patientsState);
  const { data, error } = trpc.useQuery([
    "medicalRecord.get-allRecords",
    {
      patientId: patient?.id as number,
    },
  ]);

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  return (
    <div className="flex-1">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 select-none">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Physician
            </th>
            <th scope="col" className="py-3 px-6">
              Complaint
            </th>
            <th scope="col" className="py-3 px-6">
              Diagnosis
            </th>
            <th scope="col" className="py-3 px-6">
              Gaurdian
            </th>
            <th scope="col" className="py-3 px-6">
              status
            </th>
            <th scope="col" className="py-3 px-6">
              action
            </th>
          </tr>
        </thead>
        <Suspense>
          <tbody>
            {data?.map((record, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize cursor-pointer"
                  >
                    {record?.physician?.user.lastName},{" "}
                    {record?.physician?.user.firstName}
                  </th>
                  <td className="py-3 px-6">{record.chiefComplaint}</td>
                  <td className="py-3 px-6">{record.chiefComplaint}</td>
                  <td className="py-3 px-6">{record.guardian}</td>
                  <td className="py-3 px-6">{record.status}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() =>
                        router.push({
                          pathname: "record/[record]",
                          query: { record: record.id },
                        })
                      }
                    >
                      <Eye className="text-green-600 hover:text-green-700" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!data && !error ? <>No Patient Data</> : null}
          </tbody>
        </Suspense>
      </table>
    </div>
  );
};

export default PatientRecord;
