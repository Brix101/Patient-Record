import React from "react";

function OutlinedButton({
  children,
  onClick,
  className,
  type = "button",
  tooltip,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  tooltip?: string;
}) {
  return (
    <button
      type={type}
      className={`group relative w-full inline-flex justify-center p-2 h-11 items-center text-xl text-center font-medium text-gray-900 rounded-lg border-2 border-gray-900 shadow-sm hover:bg-red-50 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2  ${className}`}
      onClick={onClick}
    >
      {tooltip ? (
        <span className="pointer-events-none text-[10px] absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 text-white opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100">
          {tooltip}
        </span>
      ) : null}
      {children}
    </button>
  );
}

export default OutlinedButton;
