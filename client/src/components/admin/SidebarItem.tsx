import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import { Divider, ListSubheader } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface navItem {
  name: string;
  to: string;
  icon?: ReactElement<any, any>;
  current?: boolean;
}

function SidebarItem() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navigation: navItem[] = [
    {
      name: "Dashboard",
      to: "/admin",
      icon: <DashboardIcon />,
      current: pathname === "/admin",
    },
    {
      name: "Rooms",
      to: "rooms",
      icon: <RoomPreferencesIcon />,
      current: pathname === "/admin/rooms",
    },
    {
      name: "Manage User",
      to: "manage-user",
      icon: <ManageAccountsIcon />,
      current: pathname === "/admin/manage-user",
    },
  ];
  return (
    <>
      {navigation.map((item, i) => (
        <ListItemButton
          key={i}
          selected={item.current}
          onClick={() => {
            navigate(item.to, { state: item.name });
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </>
  );
}

export default SidebarItem;
