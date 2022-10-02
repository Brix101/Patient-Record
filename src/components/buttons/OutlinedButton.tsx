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
      className={`h-11 items-center rounded-lg border border-gray-600 bg-slate-50 p-2 text-sm font-medium text-black shadow-sm hover:bg-slate-100  ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default OutlinedButton;
