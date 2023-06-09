import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { SubscribeArgs, SubscribeStatus } from "../types";
import { InitStatus } from "../helpers";

/**
 * Hook for subscribing to an event.
 * @param subscribeArgs - The arguments for subscribing to the event.
 * @returns An object containing the subscription status.
 * @example
 * const { status } = useSubscribe({
 *   eventName: "Transfer",
 *   address: "0xabcdef1234567890",
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
  const { eventName, address, onDataCallback } = subscribeArgs;

  let subscription;

  const subscribeToEvent = useCallback(async () => {
    if (!provider) throw new Error("No provider");

    try {
      updateStatus({ isSubscribing: true });
      subscription = await provider.subscribe(eventName, { address });

      subscription.on("data", (data) => {
        onDataCallback(data.state);
      });
      updateStatus({ isSubscribed: true });
      updateStatus({ isError: false });
    } catch (error) {
      console.error("Error subscribing to event:", error);
      updateStatus({ error: error as unknown as Error });
      updateStatus({ isError: true });
    } finally {
      updateStatus({ isSubscribing: true });
    }
  }, [provider, ...Object.values(subscribeArgs)]);

  useEffect(() => {
    subscribeToEvent();
  }, [provider, onDataCallback, subscription]);

  return { status };
};
