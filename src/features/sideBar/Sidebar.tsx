import React from "react";
import { ChevronsLeft, Menu } from "react-feather";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { sideBarState, toggleSideBar } from "./sideBarSlice";

function Sidebar({ children }: { children?: React.ReactNode | null }) {
  const dispatch = useAppDispatch();
  const { open } = useAppSelector(sideBarState);
  return (
    <>
      <div
        className={`flex-shrink-0 w-64 flex flex-col transition-all duration-300 drop-shadow-2xl ${
          !open && "-ml-64"
        }`}
      >
        <div className="h-full  bg-green-50">
          <div className="w-full relative h-12 bg-green-50  shadow-sm">
            <div
              className={`absolute w-full h-full bg-inherit flex justify-end items-center rounded-b-3xl transition-all duration-300 ${
                open ? "right-0" : "-right-14"
              }`}
            >
              <button
                className="p-1 mr-4 hover:bg-green-200 rounded-md"
                onClick={() => dispatch(toggleSideBar())}
              >
                {open ? <ChevronsLeft size={24} /> : <Menu size={24} />}
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
