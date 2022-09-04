import React from "react";
import { useNavigate } from "react-router-dom";
function Page404() {
  const navigate = useNavigate();
  return <h1>not found</h1>;
}

export default Page404;
