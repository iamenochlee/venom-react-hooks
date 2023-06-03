import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VenomConnect } from "venom-connect";
import { getAddress } from "../getters/getAddress";
import { ProviderRpcClient } from "everscale-inpage-provider";
import { Account } from "../types";

export const useVenomConnect = (
  initVenomConnect: () => Promise<VenomConnect>,
  provider: ProviderRpcClient | null,
  setProvider: Dispatch<SetStateAction<ProviderRpcClient | null>>,
  setAccount: Dispatch<SetStateAction<Account | null>>
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

    const address = await getAddress(provider);
    const balance = await provider?.getBalance(address);
    if (address) {
      setAccount({ address, balance });
      setIsConnected(true);
    }
  };

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
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
  };
};
