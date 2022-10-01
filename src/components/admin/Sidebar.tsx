import React from "react";

function Sidebar({
  sidebarOpen,
  children,
}: {
  sidebarOpen: boolean;
  children?: React.ReactNode | null;
}) {
  return (
    <>
      <div
        className={`flex-shrink-0 w-64 flex flex-col transition-all duration-300 drop-shadow-2xl ${
          !sidebarOpen && "-ml-64"
        }`}
      >
        <div className="h-full  bg-green-500">
          <div className="w-full h-12 bg-green-50" />
          {children}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
