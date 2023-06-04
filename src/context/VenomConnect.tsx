import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VenomConnect } from "venom-connect";
import { getAccount } from "../getters/getAccount";
import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { Account } from "../types";

export const useVenomConnect = (
  initVenomConnect: () => Promise<VenomConnect>,
  provider: ProviderRpcClient | null,
  setProvider: Dispatch<SetStateAction<ProviderRpcClient | null>>,
  setAccount: Dispatch<SetStateAction<Account | undefined>>
) => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
    console.log("connection initiated");
  };

  const onConnect = async (provider: any) => {
    setProvider(provider);

    const account = await getAccount(provider);
    if (account) {
      const balance = await provider?.getBalance(account?.address as Address);
      setAccount({ ...account, balance });
      setIsConnected(true);
    }
  };

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAccount(_venomConnect);
  };

  const login = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };

  const disconnect = async () => {
    provider?.disconnect();
    setProvider(null);
    setIsConnected(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const off = venomConnect?.on("connect", onConnect);
    if (venomConnect) {
      checkAuth(venomConnect);
    }

    return () => {
      off?.();
    };
  }, [venomConnect]);

  return {
    login,
    disconnect,
    isConnected,
    venomConnect,
  };
};
