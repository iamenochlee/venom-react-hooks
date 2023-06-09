import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VenomConnect } from "venom-connect";
import { getAccount } from "../getters/getAccount";
import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { Account } from "../types";

/**
 * Custom hook for connecting to Venom and managing connection state.
 * @param initVenomConnect - A function that initializes VenomConnect.
 * @param provider - The current provider instance.
 * @param setProvider - A function to set the provider instance.
 * @param setAccount - A function to set the current account.
 * @returns An object containing the login, disconnect, isConnected, and venomConnect functions.
 * @example
 * const { login, disconnect, isConnected, venomConnect } = useVenomConnect(initVenomConnect, provider, setProvider, setAccount);
 * if (isConnected) {
 *   console.log("Connected to Venom!");
 * }
 * login();
 */
export const useVenomConnect = (
  initVenomConnect: () => Promise<VenomConnect>,
  provider: ProviderRpcClient | null,
  setProvider: Dispatch<SetStateAction<ProviderRpcClient | null>>,
  setAccount: Dispatch<SetStateAction<Account | undefined>>
) => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Initialize the Venom connection.
   */
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
    console.log("Connection initiated");
  };

  /**
   * Event handler for connecting to the provider.
   * @param provider - The provider instance.
   */
  const onConnect = async (provider: any) => {
    setProvider(provider);

    const account = await getAccount(provider);
    if (account) {
      const balance = await provider?.getBalance(account?.address as Address);
      setAccount({ ...account, balance });
      setIsConnected(true);
    }
  };

  /**
   * Check authentication status on the VenomConnect instance.
   * @param _venomConnect - The VenomConnect instance.
   */
  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAccount(_venomConnect);
  };

  /**
   * Initiate the login process with VenomConnect.
   */
  const login = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };

  /**
   * Disconnect from the provider and reset connection state.
   */
  const disconnect = async () => {
    provider?.disconnect();
    setProvider(null);
    setIsConnected(false);
    setAccount(undefined);
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
