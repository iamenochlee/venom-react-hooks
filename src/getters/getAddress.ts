export const getAddress = async (provider: any) => {
  const providerState = await provider?.getProviderState?.();
  return providerState?.permissions.accountInteraction?.address.toString();
};
