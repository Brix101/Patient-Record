import { useAppSelector } from "@/app/hook";
import { NextPage } from "next";
import React from "react";
import { patientsState } from "./patientsSlice";

const PatientRecord: NextPage = () => {
  const { patient } = useAppSelector(patientsState);
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
              weight
            </th>
            <th scope="col" className="py-3 px-6">
              height
            </th>
            <th scope="col" className="py-3 px-6">
              status
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default PatientRecord;
