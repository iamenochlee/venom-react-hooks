import { Address } from "everscale-inpage-provider";
import { useVenomProvider } from "../context/VenomProvider";

export const addAsset = (to: string, address: string) => {
  const { provider } = useVenomProvider();

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
