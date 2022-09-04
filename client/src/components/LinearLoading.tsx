import { LinearProgress } from "@mui/material";
import React from "react";
import { useConnectionStateQuery } from "../services/connection";

function LinearLoading() {
  const { isLoading } = useConnectionStateQuery("", {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isLoading)
    return (
      <>
        <div
          className="absolute z-50 w-full h-full bg-inherit"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <LinearProgress color="primary" />
        </div>
      </>
    );
}

export default LinearLoading;
