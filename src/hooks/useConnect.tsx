import { useVenomConnect } from "../context/VenomConnect";
import { useVenomProvider } from "../context/VenomProvider";
import { useVenomConfig } from "../context/VenomConfig";
import { useState } from "react";
import { Account } from "../types";

export const useConnect = () => {
  const { setProvider, provider } = useVenomProvider();
  const [account, setAccount] = useState<Account | undefined>(undefined);

  const { initVenomConnect } = useVenomConfig();

  const { login, disconnect, isConnected, venomConnect } = useVenomConnect(
    initVenomConnect,
    provider,
    setProvider,
    setAccount
  );

  return {
    account,
    login,
    disconnect,
    isConnected,
    venomConnect,
  };
};
