import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

function GenericInput({
  label,
  placeHolder,
  register,
  enable = false,
}: {
  label?: string;
  placeHolder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  register: UseFormRegisterReturn<any>;
  enable?: boolean;
}) {
  return (
    <div>
      <label
        className={`block text-sm font-medium  dark:text-gray-300 ${
          enable ? "text-gray-900" : "text-gray-200"
        }`}
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm ">
        <input
          type="text"
          className={`border mt-1 ${
            enable
              ? "border-gray-300"
              : "bg-white border border-gray-100 placeholder:text-gray-200"
          } block w-full  bg-white h-10 rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm`}
          placeholder={placeHolder}
          required
          {...register}
          disabled={!enable}
        />
      </div>
    </div>
  );
}

export default GenericInput;
