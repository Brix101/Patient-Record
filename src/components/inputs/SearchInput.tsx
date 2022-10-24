import React from "react";
import { Search } from "react-feather";

function SearchInput({
  value,
  onChange,
  required,
  placeholder,
}: {
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center h-11 w-full">
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          className=" block w-full pl-10 p-2.5 h-full rounded-md border  border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          z
        />
      </div>
    </div>
  );
}

export default SearchInput;
