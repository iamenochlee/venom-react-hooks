import { ProviderRpcClient } from "everscale-inpage-provider";
import { ReactNode, createContext, useContext, useState } from "react";

const defaultContext: Type = {
  provider: null,
  setProvider: () => null,
};
const Context = createContext<Type>(defaultContext);

interface Type {
  provider: ProviderRpcClient | null;
  setProvider: React.Dispatch<React.SetStateAction<ProviderRpcClient | null>>;
}

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
