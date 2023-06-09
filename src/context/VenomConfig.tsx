import { createContext, useContext } from "react";
import { ProviderContext } from "./VenomProvider";
import { VenomConfigContextValue, VenomConfigProps } from "../types";

/**
 * Context for Venom configuration values.
 */
const VenomConfigContext = createContext<VenomConfigContextValue | undefined>(
  undefined
);

/**
 * Component for providing Venom configuration values.
 * @param props - The VenomConfigProps object.
 * @returns The VenomConfig component.
 * @example
 * <VenomConfig initVenomConnect={initVenomConnect}>
 *   <App />
 * </VenomConfig>
 */

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

/**
 * Hook for accessing Venom configuration values.
 * @returns The VenomConfigContextValue object.
 * @throws {Error} If the VenomConfigContextValue is not provided.
 * @example
 * const { initVenomConnect } = useVenomConfig();
 * console.log("Venom Connect initialized with:", initVenomConnect);
 */

export const useVenomConfig = (): VenomConfigContextValue => {
  const context = useContext(VenomConfigContext);
  if (!context) {
    throw new Error("VenomConfigContextValue must be passed");
  }
  return context;
};
