import { Address } from "everscale-inpage-provider";
import { useVenomProvider } from "../context/VenomProvider";

/**
 * Adds an asset to a specific account.
 * @param to - The recipient account address.
 * @param address - The address of the asset's root contract.
 * @returns An object containing the `add` function.
 * @example
 * const { add } = addAsset("recipientAddress", "assetAddress");
 * const response = await add();
 * console.log(response);
 */
export const addAsset = (to: string, address: string) => {
  const { provider } = useVenomProvider();

  /**
   * Adds the asset to the recipient account.
   * @returns A promise that resolves with the response from the provider.
   */
  const add = async () => {
    const response = await provider?.addAsset({
      account: new Address(to),
      params: {
        rootContract: new Address(address),
      },
      type: "tip3_token",
    });
    return response;
  };

  return { add };
};
