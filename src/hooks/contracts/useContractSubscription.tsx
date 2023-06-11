import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { ContractSubscribeArgs, SubscribeStatus } from "../../types";
import { InitStatus } from "../../helpers";
import { Contract } from "everscale-inpage-provider";

/**
 * Custom hook for subscribing to a contract event using the specified subscribeArgs.
 * @param subscribeArgs - The arguments for subscribing to the contract event.
 * @returns An object containing the status of the subscription.
 * @example
 * const subscribeArgs = {
 *   abi: contractAbi,
 *   eventName: "Transfer",
 *   address: "0:x1234567890abcdef",
 *   onDataCallback: (data) => {
 *     console.log("Received event data:", data);
 *   }
 * };
 * const { status } = useContractSubscription(subscribeArgs);
 * console.log(status.isSubscribed); // true if the subscription is active
 */
export const useContractSubscription = (
  subscribeArgs: ContractSubscribeArgs
): { status: SubscribeStatus } => {
  const { provider } = useVenomProvider();
  const { status, updateStatus } = InitStatus({
    isSubscribed: false,
    isSubscribing: false,
  } as SubscribeStatus);

  const { abi, eventName, address, onDataCallback } = subscribeArgs;

  let contract: Contract<typeof abi>;

  const subscribeToEvent = useCallback(async () => {
    if (!provider) throw new Error("No provider");

    try {
      updateStatus({ isSubscribing: true });
      contract = new provider.Contract(abi, address);
      const subscription = contract.events(new provider.Subscriber());
      subscription.on((event) => {
        if (event.event !== eventName) return;
        console.log(event.data);
        onDataCallback(event.data);
      });
      updateStatus({ isSubscribed: true });
      updateStatus({ isError: false });
    } catch (error) {
      console.error("Error subscribing to event:", error);
      updateStatus({ error: error as unknown as Error });
      updateStatus({ isError: true });
    } finally {
      updateStatus({ isSubscribing: false });
    }
  }, Object.values(subscribeArgs));

  useEffect(() => {
    subscribeToEvent();
  }, [provider]);

  return { status };
};
