import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { InitStatus } from "../helpers";
import { SignStatus, SignMessageArgs } from "../types";

/**
 * Hook for signing a message.
 * @param signArgs - The arguments for signing the message.
 * @returns An object containing the sign function and the  `SignStatus`.
 * @example
 * const { sign, status } = useSignMessage({
 *   publicKey: "0xabcdef1234567890",
 *   data: "Hello, Venom!",
 *   onComplete: (result) => {
 *     console.log("Message signed successfully:", result);
 *   },
 *   onError: (error) => {
 *     console.error("Error occurred while signing the message:", error);
 *   },
 *   onSettled: (result, error) => {
 *     if (error) {
 *       console.log("Message signing settled with an error:", error);
 *     } else {
 *       console.log("Message signing settled successfully:", result);
 *     }
 *   },
 * });
 **/

export const useSignMessage = (signArgs: SignMessageArgs) => {
  const {
    publicKey,
    data,
    raw,
    withSignatureId,
    onComplete,
    onError,
    onSettled,
  } = signArgs;
  const { provider } = useVenomProvider();
  const { status, updateStatus } = InitStatus({
    isLoading: false,
    isSigned: false,
  } as SignStatus);

  const sign = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateStatus({ isLoading: true });
      updateStatus({ isSigning: true });
      const result = await provider[raw ? "signDataRaw" : "signData"]({
        publicKey,
        data: btoa(data),
        withSignatureId,
      });

      updateStatus({ isSigned: true });
      updateStatus({ result });
      updateStatus({ isSuccess: true });
      onComplete?.(result);
    } catch (error) {
      updateStatus({ isError: true });
      updateStatus({ error });
      onError?.(error as Error);
    } finally {
      updateStatus({ isLoading: false });
      updateStatus({ isSigning: false });
    }
  }, Object.values(signArgs));

  useEffect(() => {
    if (!status.isLoading && status.isSigned) {
      onSettled?.(status.result, status.error);
    }
  }, [status]);
  return { sign, status };
};
