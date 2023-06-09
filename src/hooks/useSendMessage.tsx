import { Address } from "everscale-inpage-provider";
import { SendStatus, SendInternalMessageArgs } from "../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { InitStatus } from "../helpers";

/**
 * Hook for sending an internal message.
 * @param args - The arguments for sending the internal message.
 * @returns An object containing the run function and the send status.
 * @example
 * const { run, status } = useSendMessage({
 *   from: "0:x1234567890abcdef",
 *   to: "0:xabcdef1234567890",
 *   amount: "100",
 *   onComplete: (result) => {
 *     console.log("Message sent successfully:", result);
 *   },
 *   onError: (error) => {
 *     console.error("Error occurred while sending the message:", error);
 *   },
 *   onSettled: (result, error) => {
 *     if (error) {
 *       console.log("Message settled with an error:", error);
 *     } else {
 *       console.log("Message settled successfully:", result);
 *     }
 *   },
 *   overrides?: {
 *     bounce?: false,
 *   },
 * });
 */

export const useSendMessage = (
  args: SendInternalMessageArgs
): {
  run: () => Promise<void>;
  status: SendStatus;
} => {
  const {
    from,
    to,
    amount,
    isDelayed,
    onComplete,
    onError,
    onSettled,
    overrides,
    payload,
    stateInit,
  } = args;
  const { provider } = useVenomProvider();

  const { status, updateStatus } = InitStatus({
    isLoading: false,
    isSent: false,
  } as SendStatus);

  /**
   * Function to send the internal message.
   * @returns A promise that resolves when the message is sent.
   */
  const run = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateStatus({ isLoading: true });
      updateStatus({ isSending: true });
      const result = await provider?.[
        isDelayed ? "sendMessageDelayed" : "sendMessage"
      ]({
        sender: from,
        recipient: new Address(to),
        amount,
        payload: payload ?? undefined,
        stateInit: stateInit ?? undefined,
        bounce: overrides?.bounce ?? false,
      });
      updateStatus({ isSent: true });
      console.log(result);

      updateStatus({ isError: false });
      updateStatus({ result });
      updateStatus({ isSuccess: true });
      onComplete?.(result);
    } catch (error) {
      updateStatus({ isError: true });
      updateStatus({ error });
      updateStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateStatus({ isLoading: false });
      updateStatus({ isSending: false });
    }
  }, [provider, args]);

  useEffect(() => {
    if (!status.isLoading && !status.isSent) {
      onSettled?.(status.result, status.error);
    }
  }, [status]);

  return { run, status };
};
