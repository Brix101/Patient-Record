import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

function Gender({ register }: { register: UseFormRegisterReturn<any> }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
        Gender
      </label>
      <select
        id="gender"
        className="block w-full h-10 rounded-md border bg-white border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
        {...register}
      >
        <option value="" selected disabled hidden>
          Gender
        </option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>
    </div>
  );
}

export default Gender;
