import SearchInput from "@/components/inputs/SearchInput";
import Admin from "@/components/Layout/Admin";
import LinearLoading from "@/components/LinearLoading";
import useDebounce from "@/hooks/useDebounce";
import { SearchLogInput } from "@/schema/log.schema";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

const UsersPage: NextPage = () => {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 7);
  const [searchInput, setSearchInput] = useState<SearchLogInput>({
    name: "",
    fromDate: defaultDate,
    toDate: new Date(),
  });
  const debouncedValue = useDebounce<SearchLogInput>(searchInput, 500);
  const { data, isLoading, isRefetching } = trpc.useQuery(
    [
      "logs.get-logs",
      {
        ...debouncedValue,
      },
    ],
    { enabled: true }
  );

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  return (
    <>
      <Head>
        <title>Management - Logs</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Admin>
        <div className="relative shadow-md sm:rounded-lg mx-5 p-5 overflow-hidden min-h-screen">
          <div className="h-20 w-full flex justify-between items-center pt-2 px-5">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">User Logs</h1>
            </div>
            <div className="flex gap-2 w-auto items-center">
              <div className="flex gap-1 items-center">
                <p>From: </p>
                <DatePicker
                  className="block w-full max-w-[150px] h-10 rounded-md border  border-gray-300 px-2 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm cursor-pointer"
                  placeholderText="Date From"
                  onChange={(dateValue) =>
                    setSearchInput({
                      ...searchInput,
                      fromDate: dateValue as Date,
                    })
                  }
                  selected={
                    searchInput.fromDate ? searchInput.fromDate : defaultDate
                  }
                  dateFormat="MMMM-dd-yyyy"
                  selectsStart
                  startDate={searchInput.fromDate}
                  endDate={searchInput.toDate}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div className="flex gap-1 items-center">
                <p>To: </p>
                <DatePicker
                  className="block w-full max-w-[150px] h-10 rounded-md border  border-gray-300 px-2 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm cursor-pointer"
                  placeholderText="Date To"
                  onChange={(dateValue) =>
                    setSearchInput({
                      ...searchInput,
                      toDate: dateValue as Date,
                    })
                  }
                  selected={
                    searchInput.toDate ? searchInput.toDate : new Date()
                  }
                  dateFormat="MMMM-dd-yyyy"
                  selectsEnd
                  startDate={searchInput.fromDate}
                  endDate={searchInput.toDate}
                  minDate={searchInput.fromDate}
                  onKeyDown={(e) => {
                    console.log(e);
                    // e.preventDefault();
                  }}
                />
              </div>
              <div>
                <SearchInput
                  placeholder="Search a Name"
                  value={searchInput.name}
                  onChange={(e) =>
                    setSearchInput({ ...searchInput, name: e.target.value })
                  }
                />
              </div>
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
                  role
                </th>
                <th scope="col" className="py-3 px-6">
                  Type
                </th>
                <th scope="col" className="py-3 px-6">
                  date
                </th>
                <th scope="col" className="py-3 px-6">
                  time
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((log, i) => {
                return (
                  <tr key={i} className={`${TableStyle(i)}`}>
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                    >
                      {log.user.lastName && log.user.lastName},{" "}
                      {log.user.firstName && log.user.firstName}
                    </th>
                    <td className="py-4 px-6">
                      {log.user.role && log.user.role}
                    </td>
                    <td className="py-4 px-6">{log.type}</td>
                    <td className="py-4 px-6">{log.createAt.toDateString()}</td>
                    <td className="py-4 px-6">
                      {log.createAt.toLocaleTimeString("en-US")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Admin>
    </>
  );
};

export default UsersPage;
