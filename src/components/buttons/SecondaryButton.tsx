import React from "react";

function SecondaryButton({
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
      className={`inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-blue-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
