import { createTheme, LinearProgress, ThemeProvider } from "@mui/material";
import { green, indigo, purple } from "@mui/material/colors";
import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./layout/Admin";
import Main from "./layout/Main";
import About from "./pages/About";
import Dashboard from "./pages/admin/Dashboard";
import ManageUser from "./pages/admin/ManageUser";
import Rooms from "./pages/admin/Rooms";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import { useConnectionStateQuery } from "./services/connection";

const theme = createTheme();

function App() {
  const { data, error, isLoading, isError } = useConnectionStateQuery("", {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <LinearProgress color="primary" />;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="rooms" element={<Rooms />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
