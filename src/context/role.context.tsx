import React, { createContext, useContext } from "react";

const RoleContext = createContext<string | null>(null);

function RoleContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string | undefined;
}) {
  return (
    <RoleContext.Provider value={value || null}>
      {children}
    </RoleContext.Provider>
  );
}

const useRoleContext = () => useContext(RoleContext);

export { useRoleContext, RoleContextProvider };
