import React from "react";

function OutlinedButton({
  children,
  onClick,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      className={`w-full inline-flex justify-center p-2 h-11 items-center text-xl text-center font-medium text-gray-900 rounded-lg border-2 border-gray-900 shadow-sm hover:bg-red-50 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2  ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default OutlinedButton;
