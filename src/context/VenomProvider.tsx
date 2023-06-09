import { ProviderRpcClient } from "everscale-inpage-provider";
import { ReactNode, createContext, useContext, useState } from "react";
import { VenomProvider } from "../types";

/**
 * Context for Venom provider values.
 */
const Context = createContext<VenomProvider>({
  provider: null,
  setProvider: () => null,
});

/**
 * Component for providing Venom provider values.
 * @param children - The children elements.
 * @returns The ProviderContext component.
 * @example
 * <ProviderContext>
 *   <App />
 * </ProviderContext>
 */

export const ProviderContext = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ProviderRpcClient | null>(null);
  return (
    <Context.Provider value={{ provider, setProvider }}>
      {children}
    </Context.Provider>
  );
};

/**
 * Hook for accessing Venom provider values.
 * @returns The VenomProvider object.
 * @example
 * const { provider, setProvider } = useVenomProvider();
 * console.log("Current provider:", provider);
 * setProvider(newProvider);
 */

export const useVenomProvider = () => {
  return useContext(Context);
};
