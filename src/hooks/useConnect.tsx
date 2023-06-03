import { useVenomConnect } from "../context/VenomConnect";
import { useVenomProvider } from "../context/VenomProvider";
import { useVenomConfig } from "../context/VenomConfig";
import { useState } from "react";
import { Account } from "../types";

export const useConnect = () => {
  const { setProvider, provider } = useVenomProvider();
  const [account, setAccount] = useState<Account | null>(null);

  const { connect } = useVenomConfig();

  const { login, disconnect, isConnected } = useVenomConnect(
    connect,
    provider,
    setProvider,
    setAccount
  );

  return {
    account,
    login,
    disconnect,
    isConnected,
  };
};
