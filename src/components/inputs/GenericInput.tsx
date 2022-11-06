import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

function GenericInput({
  label,
  placeHolder,
  type,
  required,
  register,
}: {
  label?: string;
  placeHolder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  register?: UseFormRegisterReturn<string>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-grey-700">{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm ">
        <input
          type={type}
          className="block w-full h-10 capitalize rounded-md border  border-gray-300 pl-3 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
          placeholder={placeHolder}
          required={required}
          {...register}
        />
      </div>
    </div>
  );
}

export default GenericInput;
