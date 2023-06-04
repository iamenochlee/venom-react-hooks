import { createContext, useContext } from "react";
import { ProviderContext } from "./VenomProvider";
import { VenomConfigContextValue, VenomConfigProps } from "../types";

const VenomConfigContext = createContext<VenomConfigContextValue | undefined>(
  undefined
);

export const VenomConfig = ({
  children,
  initVenomConnect,
}: VenomConfigProps) => {
  return (
    <VenomConfigContext.Provider value={{ initVenomConnect }}>
      <ProviderContext>{children}</ProviderContext>
    </VenomConfigContext.Provider>
  );
};

export const useVenomConfig = (): VenomConfigContextValue => {
  const context = useContext(VenomConfigContext);
  if (!context) {
    throw new Error("useVenomConfig must be used within VenomConfigProvider");
  }
  return context;
};
