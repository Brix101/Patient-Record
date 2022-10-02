import React from "react";

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
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          className=" block w-full pl-10 p-2.5 h-full rounded-md border  border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 sm:text-sm"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default SearchInput;
