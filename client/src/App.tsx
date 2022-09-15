import { LinearProgress, ThemeProvider } from "@mui/material";
import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import theme from "./components/modules/theme";
import Dashboard from "./layout/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUser from "./pages/admin/ManageUser";
import Rooms from "./pages/admin/Rooms";
import Appointment from "./pages/doctor/Appointment";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Home from "./pages/Home";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import Patient from "./pages/nurse/Patient";
import SignIn from "./pages/SignIn";
import { useConnectionStateQuery } from "./services/connection";

function App() {
  const { isLoading, isError } = useConnectionStateQuery("", {
    // pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <LinearProgress color="primary" />;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="admin" element={<Dashboard />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="rooms" element={<Rooms />} />
          </Route>
          <Route path="doctor" element={<Dashboard />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointment" element={<Appointment />} />
          </Route>
          <Route path="nurse" element={<Dashboard />}>
            <Route index element={<NurseDashboard />} />
            <Route path="patient" element={<Patient />} />
          </Route>
          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
