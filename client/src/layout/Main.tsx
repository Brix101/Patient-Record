import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import AppBar from "../components/AppBar";

function Main() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar />
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Main;
