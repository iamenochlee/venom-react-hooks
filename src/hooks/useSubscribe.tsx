import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { SubscribeArgs, SubscribeStatus } from "../types";
import { InitStatus } from "../helpers";

/**
 * Hook for subscribing to a contract.
 * @param subscribeArgs - The arguments for subscribing to changes on a the state on a contract i.e `contractStateChanged`.
 *
 * @returns An object containing the subscription status.
 * @example
 * const { status } = useSubscribe({
 *   address: "0:xabcdef1234567890",
 *   onDataCallback: (data) => {
 *     console.log("Received event data:", data);
 *   },
 * });
 */
export const useSubscribe = (subscribeArgs: SubscribeArgs) => {
  const { provider } = useVenomProvider();
  const { status, updateStatus } = InitStatus({
    isSubscribed: false,
    isSubscribing: false,
  } as SubscribeStatus);
  const { address, onDataCallback } = subscribeArgs;

  let subscription;

  const subscribeToEvent = useCallback(async () => {
    if (!provider) throw new Error("No provider");

    try {
      updateStatus({ isSubscribing: true });
      subscription = await provider.subscribe("contractStateChanged", {
        address,
      });

      subscription.on("data", (data) => {
        onDataCallback(data.state);
      });

      updateStatus({ isSubscribed: true });
      updateStatus({ isError: false });
    } catch (error) {
      console.error("Error subscribing", error);
      updateStatus({ error: error as unknown as Error });
      updateStatus({ isError: true });
    } finally {
      updateStatus({ isSubscribing: true });
    }
  }, Object.values(subscribeArgs));

  useEffect(() => {
    subscribeToEvent();
  }, [provider]);

  return { status };
};
