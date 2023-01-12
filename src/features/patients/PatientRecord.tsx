import { useAppSelector } from "@/app/hook";
import { trpc } from "@/utils/trpc";
import {
  MedicalRecord,
  MedicineRequest,
  Patient,
  Physician,
  Receipt,
  Room,
  User,
} from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { FileText, Trash2 } from "react-feather";
import { patientsState } from "./patientsSlice";

const PatientRecord: NextPage = () => {
  const router = useRouter();
  const { patient, isEditPatient } = useAppSelector(patientsState);
  const [record, setRecord] = useState<
    (MedicalRecord & {
      receipt: Receipt | null;
      physician:
        | (Physician & {
            user: User;
          })
        | null;
      medicineRequest: MedicineRequest[];
      room: Room | null;
      patient: Patient | null;
    })[]
  >();

  const { data, error, refetch } = trpc.useQuery(
    [
      "medicalRecord.get-allRecords",
      {
        patientId: patient?.id as number,
      },
    ],
    {
      onSuccess(data) {
        setRecord(data);
      },
    }
  );

  const { mutate } = trpc.useMutation(["medicalRecord.delete-record"], {
    onMutate: (variables) => {
      setRecord((prev) => prev?.filter((items) => items !== variables));
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    refetch();
  }, [isEditPatient, refetch]);

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const deleteDialog = ({
    record,
  }: {
    record: MedicalRecord & {
      receipt: Receipt | null;
      physician:
        | (Physician & {
            user: User;
          })
        | null;
      medicineRequest: MedicineRequest[];
      room: Room | null;
      patient: Patient | null;
    };
  }) => {
    if (window.confirm("Are you sure to Delete this Record")) {
      mutate({ ...record });
    }
  };

  return (
    <div className="flex-1">
      <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-400">Patient Records</h1>
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
            {record?.map((rec, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize cursor-pointer"
                  >
                    {rec?.physician ? (
                      <>
                        {rec?.physician?.user.lastName},{" "}
                        {rec?.physician?.user.firstName}
                      </>
                    ) : null}
                  </th>
                  <td className="py-3 px-6">{rec.chiefComplaint}</td>
                  <td className="py-3 px-6">{rec.chiefComplaint}</td>
                  <td className="py-3 px-6">{rec.guardian}</td>
                  <td className="py-3 px-6">{rec.status}</td>
                  <td className="py-3 px-6 space-x-3">
                    <button
                      onClick={() =>
                        router.push({
                          pathname: "record/[record]",
                          query: { record: rec.id },
                        })
                      }
                    >
                      <FileText className="text-green-600 hover:text-green-700" />
                    </button>
                    {rec.receipt ? null : (
                      <button onClick={() => deleteDialog({ record: rec })}>
                        <Trash2 className="text-red-600 hover:text-red-700" />
                      </button>
                    )}
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
