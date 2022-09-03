import * as React from "react";
import { useGetPokemonByNameQuery } from "./app/api";

function App() {
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");

  console.log(data);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
