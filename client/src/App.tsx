import * as React from "react";
import { useConnectionStateQuery } from "./services/connection";

function App() {
  const { data, error, isLoading } = useConnectionStateQuery("", {
    pollingInterval: 1000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (error) {
    console.log(error);
  }
  if (isLoading) {
    console.log("isLoading");
  }
  console.log(data);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
