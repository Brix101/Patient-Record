import Main from "@/components/Layout/Main";
import SuspenseComponent from "@/components/SuspenseComponent";
import { trpc } from "@/utils/trpc";
import {
  Appointment,
  MedicalRecord,
  Medicine,
  Patient,
  Physician,
  Receipt,
  Room,
  User,
} from "@prisma/client";
import moment from "moment";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

const TableStyle = (x: number) => {
  if (x % 2) {
    return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
  }
  return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
};

const Home: NextPage = () => {
  const { data } = useSession();

  const { data: patientData, isLoading: isPatientLoading } = trpc.useQuery([
    "patient.get-registered-patient",
    {
      id: parseInt(data?.user?.id as string),
    },
  ]);

  const [record, setRecord] = useState<
    | (MedicalRecord & {
        receipt: Receipt | null;
        appointments: (Appointment & {
          physician: Physician & {
            user: User;
          };
        })[];

        physician:
          | (Physician & {
              user: User;
            })
          | null;
        room: Room | null;
        patient: Patient | null;
        medicine: Medicine[];
      })
    | undefined
  >();

  const { isLoading: isRecordLoading } = trpc.useQuery(
    [
      "medicalRecord.get-allRecords",
      {
        patientId: patientData?.id as number,
      },
    ],
    {
      onSuccess(data) {
        setRecord(data.at(-1));
      },
    }
  );

  const admitedD = moment(record?.admittedAt);
  const nowD = moment(record?.receipt?.createAt ?? new Date());
  const roomTime = nowD.diff(admitedD, "days", true);
  const roomPrice = (record?.room
    ? record?.room?.price
    : 0) as unknown as number;
  const roomCharge = roomPrice * roomTime; //room total price

  const appointmentCharge = record?.appointments
    .map((appointment) => {
      const startD = moment(appointment?.start);
      const endD = moment(appointment.end);
      const totalTime = endD.diff(startD, "hours", true);
      const phyCharge = appointment.physician
        .sessionCharge as unknown as number;
      const subTotal = totalTime * phyCharge;
      const total = appointment.status === "Finished" ? subTotal : 0;

      return total;
    })
    .reduce((a, b) => a + b, 0) as unknown as number;

  const medicineCharge = record?.medicine
    .map((item) => item.total)
    .reduce((a, b) => {
      const totalA = a as unknown as string;
      const totalB = b as unknown as string;
      const total = parseFloat(totalA) + parseFloat(totalB);

      return total as unknown as number;
    }, 0) as unknown as number;

  const totalCharge = roomCharge + appointmentCharge + medicineCharge;

  const appointmentTotal = ({
    data,
  }: {
    data: Appointment & { physician: Physician };
  }) => {
    const startD = moment(data?.start);
    const endD = moment(data.end);
    const totalTime = endD.diff(startD, "hours", true);
    const phyCharge = data.physician.sessionCharge as unknown as number;
    const subTotal = totalTime * phyCharge;
    const total = data.status === "Finished" ? subTotal : 0;

    return total.toFixed(2).toString();
  };

  return (
    <>
      <Head>
        <title>Patient Page</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <SuspenseComponent isLoading={isPatientLoading || isRecordLoading}>
          {record ? (
            <div className="flex-1 h-full w-full  space-y-5 overflow-x-hidden">
              <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full flex items-center flex-col gap-10">
                <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-400">Record</h1>
                  </div>
                </div>
                <div className="flex flex-col max-w-4xl w-full">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Height
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.height}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Weight
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.weight}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Blood pressure
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.bloodPressure}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Room Type
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.room?.category}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Room No
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.room?.roomNo}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Physician
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.physician?.user.firstName +
                            " " +
                            record.physician?.user.lastName}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Chief Complaint
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.chiefComplaint}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Guardian
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.guardian}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Guardian No
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm ">
                        <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-100 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                          {record.guardianNo}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col max-w-4xl w-full">
                  <h1 className="text-lg font-bold text-gray-900 mb-5 capitalize">
                    Charges Summary
                  </h1>
                  {record?.receipt ? (
                    <div className="col-span-1 space-y-3 mt-5">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Room Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt.roomCharge?.toString()}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Appointment Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt.appointmentCharge?.toString()}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Medicine Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt.medicineCharge?.toString()}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Reference #
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt?.id}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Total Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt.total?.toString()}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-1 space-y-3 mt-5">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Room Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {roomCharge?.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Appointment Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {appointmentCharge?.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Medicine Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {medicineCharge?.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Reference #
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.receipt?.id}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Total Charges
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {totalCharge.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {data?.discharedAt ? (
                  <>
                    <h1 className="text-base font-bold text-gray-900 mt-5 capitalize">
                      Discharged Summary
                    </h1>
                    <div className="col-span-1 space-y-3 mt-5">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Addmitting Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.admittingDiagnosis}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Final Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.finalDiagnosis}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Other Diagnosis
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.otherDiagnosis}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Medical Result
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.result}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700">
                            Disposition
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm ">
                            <h3 className="w-full h-10 flex items-center capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm">
                              {record.status}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
                <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-400">
                      Appointments
                    </h1>
                  </div>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Appointment Id
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Physician
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Schedule Start
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Schedule End
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Status
                      </th>

                      <th scope="col" className="py-3 px-6">
                        Sub Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.appointments?.map((appointment, i) => {
                      return (
                        <tr key={i} className={`${TableStyle(i)}`}>
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                          >
                            Appointment {appointment.id}
                          </th>
                          <td className="py-4 px-6">
                            {appointment.physician.user.firstName}{" "}
                            {appointment.physician.user.lastName}
                          </td>
                          <td className="py-4 px-6">
                            {moment(appointment?.start).format(
                              "MMM DD, YYYY hh:mm A"
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {moment(appointment?.end).format(
                              "MMM DD, YYYY hh:mm A"
                            )}
                          </td>
                          <td className="py-4 px-6">{appointment.status}</td>

                          <td className="py-4 px-6">
                            {appointmentTotal({ data: appointment })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="h-20 w-full flex justify-between items-center pt-2 px-5 mr-20">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg  text-gray-900">Total :</h1>
                    <h1 className="text-lg  text-gray-900">
                      {appointmentCharge?.toFixed(2)}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden h-auto w-full">
                <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-400">
                      Medicines
                    </h1>
                  </div>
                  <div></div>
                </div>
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
                        price
                      </th>
                      <th scope="col" className="py-3 px-6">
                        sub total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.medicine?.map((medicine, i) => {
                      return (
                        <tr key={i} className={`${TableStyle(i)}`}>
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                          >
                            {medicine.name}
                          </th>
                          <td className="py-4 px-6">{medicine.quantity}</td>
                          <td className="py-4 px-6">
                            {medicine.price?.toString()}
                          </td>
                          <td className="py-4 px-6">
                            {medicine.total?.toString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="h-20 w-full flex justify-between items-center pt-2 px-5 mr-20">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg  text-gray-900">Total :</h1>
                    <h1 className="text-lg  text-gray-900">
                      {medicineCharge?.toFixed(2)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>No patient Record</div>
          )}
        </SuspenseComponent>
      </Main>
    </>
  );
};

export default Home;
