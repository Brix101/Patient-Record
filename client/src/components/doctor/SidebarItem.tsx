import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
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
      to: "/doctor",
      icon: <DashboardIcon />,
      current: pathname === "/doctor",
    },
    {
      name: "Appointment",
      to: "appointment",
      icon: <EventIcon />,
      current: pathname === "/doctor/appointment",
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
