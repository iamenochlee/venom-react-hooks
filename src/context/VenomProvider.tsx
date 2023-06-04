import { ProviderRpcClient } from "everscale-inpage-provider";
import { ReactNode, createContext, useContext, useState } from "react";
import { VenomProvider } from "../types";

const defaultContext: VenomProvider = {
  provider: null,
  setProvider: () => null,
};
const Context = createContext<VenomProvider>(defaultContext);

export const ProviderContext = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ProviderRpcClient | null>(null);
  return (
    <Context.Provider value={{ provider, setProvider }}>
      {children}
    </Context.Provider>
  );
};

export const useVenomProvider = () => {
  return useContext(Context);
};
