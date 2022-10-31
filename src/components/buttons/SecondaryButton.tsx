import React from "react";

function SecondaryButton({
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
      className={`group relative inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-blue-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
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

export default SecondaryButton;
