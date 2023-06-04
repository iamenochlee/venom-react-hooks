import { ProviderRpcClient } from "everscale-inpage-provider";

export const getAccount = async (provider: ProviderRpcClient) => {
  const providerState = await provider?.getProviderState?.();
  return providerState?.permissions.accountInteraction;
};
