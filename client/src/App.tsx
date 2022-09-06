import { createTheme, LinearProgress, ThemeProvider } from "@mui/material";
import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./layout/Admin";
import Doctor from "./layout/Doctor";
import Main from "./layout/Main";
import About from "./pages/About";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUser from "./pages/admin/ManageUser";
import Rooms from "./pages/admin/Rooms";
import Contact from "./pages/Contact";
import Appointment from "./pages/doctor/Appointment";
import DoctorDashboard from "./pages/doctor/Dashboard";
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
            <Route index element={<AdminDashboard />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="rooms" element={<Rooms />} />
          </Route>
          <Route path="doctor" element={<Doctor />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointment" element={<Appointment />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
