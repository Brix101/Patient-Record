import SearchInput from "@/components/inputs/SearchInput";
import Admin from "@/components/Layout/Admin";
import LinearLoading from "@/components/LinearLoading";
import { SearchLogInput } from "@/schema/log.schema";
import { trpc } from "@/utils/trpc";
import { refType } from "@mui/utils";
import type { NextPage } from "next";
import { HtmlProps } from "next/dist/shared/lib/html-context";
import Head from "next/head";
import React, { Ref, useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Props } from "react-select";

const UsersPage: NextPage = () => {
  const [name, setName] = useState<SearchLogInput>({ name: "" });
  const { handleSubmit, register, control } = useForm<SearchLogInput>();
  const { data, isLoading, isRefetching } = trpc.useQuery(
    [
      "logs.get-logs",
      {
        name: name.name,
      },
    ],
    { enabled: true }
  );
  console.log(data);

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
              <div>
                <Controller
                  control={control}
                  name="fromDate"
                  render={({ field }) => (
                    <DatePicker
                      className="block w-full max-w-[150px] h-10 rounded-md border  border-gray-300 px-2 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
                      placeholderText="Date From"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      dateFormat="MMMM-dd-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="toDate"
                  render={({ field }) => (
                    <DatePicker
                      className="block w-full max-w-[150px] h-10 rounded-md border  border-gray-300 px-2 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
                      placeholderText="Date To"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      dateFormat="MMMM-dd-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <SearchInput
                  placeholder="Search a Name"
                  value={name.name}
                  onChange={(e) => setName({ name: e.target.value })}
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
              {data &&
                data.map((log, i) => {
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
                      <td className="py-4 px-6">
                        {log.createAt.toDateString()}
                      </td>
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
