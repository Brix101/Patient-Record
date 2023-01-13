import SecondaryButton from "@/components/buttons/SecondaryButton";
import SearchInput from "@/components/inputs/SearchInput";
import Main from "@/components/Layout/Main";
import LinearLoading from "@/components/LinearLoading";
import useDebounce from "@/hooks/useDebounce";
import { SearchnBillingInput } from "@/schema/billing.schema";
import { MedicalRecord, Patient, Receipt } from "@prisma/client";
import { trpc } from "@utils/trpc";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Download } from "react-feather";
import Select from "react-select";

const BillingPage: NextPage = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [searchInput, setSearchInput] = useState<SearchnBillingInput>({
    name: undefined,
    philhealth: false,
  });

  const [billingData, setBillingData] = useState<
    | (Receipt & {
        medicalRecord:
          | (MedicalRecord & {
              patient: Patient | null;
            })
          | null;
      })[]
    | undefined
  >();

  const debouncedValue = useDebounce<SearchnBillingInput>(searchInput, 500);
  const { isLoading, isRefetching, refetch } = trpc.useQuery(
    [
      "billing.get-billings",
      {
        ...debouncedValue,
      },
    ],
    {
      enabled: true,
      onSuccess: (data) => {
        setBillingData(data);
      },
    }
  );

  const filterData = searchInput.philhealth
    ? billingData?.filter((bill) => bill.philHealthId)
    : billingData;

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Patient Data",
    sheet: "Patient",
  });

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  return (
    <>
      <Head>
        <title>Management - Rooms</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Main>
        <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen w-full">
          <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            </div>
            <div className="flex flex-row gap-5">
              <div className="flex items-center"></div>
              <div className="flex items-center gap-5">
                <SearchInput
                  placeholder="Search a Name"
                  value={searchInput.name as string}
                  onChange={(e) =>
                    setSearchInput({ ...searchInput, name: e.target.value })
                  }
                />
                <div>
                  <Select
                    className="w-40"
                    defaultValue={{ label: "All" }}
                    options={[{ label: "All" }, { label: "Philhealth" }]}
                    onChange={(newValue) => {
                      setSearchInput({
                        ...searchInput,
                        philhealth:
                          newValue?.label === "Philhealth" ? true : false,
                      });
                    }}
                  />
                </div>
                <SecondaryButton onClick={onDownload}>
                  <Download size={24} />
                </SecondaryButton>
              </div>
            </div>
          </div>
          <LinearLoading isLoading={isLoading || isRefetching} />
          <table
            ref={tableRef}
            className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Patient Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Philhealth Id
                </th>
                <th scope="col" className="py-3 px-6">
                  total
                </th>
                <th scope="col" className="py-3 px-6">
                  date
                </th>
              </tr>
            </thead>
            <tbody>
              {filterData?.map((bill, i) => {
                return (
                  <tr key={i} className={`${TableStyle(i)}`}>
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                    >
                      {bill.medicalRecord?.patient?.lastName},{" "}
                      {bill.medicalRecord?.patient?.firstName}{" "}
                      {bill.medicalRecord?.patient?.middleName}
                    </th>
                    <td className="py-4 px-6">{bill.philHealthId}</td>
                    <td className="py-4 px-6">{bill.total?.toString()}</td>
                    <td className="py-4 px-6">
                      {moment(bill.createAt).format("MMM DD, YYYY hh:mm A")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Main>
    </>
  );
};

export default BillingPage;
