import { Box, Toolbar } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import AppBar from "../components/AppBar";

function Main() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Main;
