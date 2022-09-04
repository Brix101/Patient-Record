import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./layout/Main";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import { useConnectionStateQuery } from "./services/connection";

function App() {
  const { data, error, isLoading, isError } = useConnectionStateQuery("", {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isError) return <div>Something went wrong</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* <Route path="dashboard" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="users" element={<Users />} />
        </Route> */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
