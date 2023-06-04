import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { InitMessageStatus } from "../helpers";
import { SignStatus, SignMessageArgs } from "../types";

const initialSignStatus: SignStatus = {
  isLoading: false,
  isSigned: false,
};

export const useSignMessage = (signArgs: SignMessageArgs) => {
  const { publicKey, data, withSignatureId, onComplete, onError, onSettled } =
    signArgs;
  const { provider } = useVenomProvider();
  const { messageStatus, updateMessageStatus } =
    InitMessageStatus(initialSignStatus);

  const sign = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateMessageStatus({ isLoading: true });
      updateMessageStatus({ isSigning: true });
      const result = await provider?.signData({
        publicKey,
        data,
        withSignatureId,
      });

      updateMessageStatus({ isSigned: true });
      updateMessageStatus({ result });
      updateMessageStatus({ isSuccess: true });
      onComplete?.(result);
    } catch (error) {
      updateMessageStatus({ isError: true });
      updateMessageStatus({ error });
      onError?.(error as Error);
    } finally {
      updateMessageStatus({ isLoading: false });
      updateMessageStatus({ isSigning: false });
    }
  }, Object.values(signArgs));

  useEffect(() => {
    if (!messageStatus.isLoading && !messageStatus.isSigned) {
      onSettled?.(messageStatus.result, messageStatus.error);
    }
  }, [messageStatus]);
  return { sign, messageStatus };
};
