import { createContext, ReactNode, useContext } from "react";
import { VenomConnect } from "venom-connect";
import { ProviderContext } from "./VenomProvider";

interface VenomConfigContextValue {
  connect: () => Promise<VenomConnect>;
}

const VenomConfigContext = createContext<VenomConfigContextValue | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
  connect: () => Promise<VenomConnect>;
}

export const VenomConfig = ({ children, connect }: Props) => {
  return (
    <VenomConfigContext.Provider value={{ connect }}>
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
