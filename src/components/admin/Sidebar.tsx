import React, { useState } from "react";
import { ChevronsLeft, Menu } from "react-feather";

function Sidebar({ children }: { children?: React.ReactNode | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <div
        className={`flex-shrink-0 w-64 flex flex-col transition-all duration-300 drop-shadow-2xl ${
          !sidebarOpen && "-ml-64"
        }`}
      >
        <div className="h-full  bg-green-500">
          <div className="w-full relative h-12 bg-green-50">
            <div
              className={`absolute w-full bg-green-50  h-full flex justify-end items-center rounded-b-3xl transition-all duration-300 ${
                !sidebarOpen ? "-right-14" : "right-0"
              }`}
            >
              <button
                className="p-1 mr-4 hover:bg-green-200 rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <ChevronsLeft size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
