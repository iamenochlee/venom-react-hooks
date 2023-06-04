import { Address } from "everscale-inpage-provider";
import { SendStatus, SendInternalMessageArgs } from "../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../context/VenomProvider";
import { InitMessageStatus } from "../helpers/InitMessageStatus";

const initialValue: SendStatus = {
  isLoading: false,
  isSent: false,
};

export const useSendMessage = (args: SendInternalMessageArgs) => {
  const {
    from,
    to,
    amount,
    isDelayed,
    onComplete,
    onError,
    onSettled,
    overrides,
  } = args;
  const { provider } = useVenomProvider();

  const { messageStatus, updateMessageStatus } =
    InitMessageStatus(initialValue);

  const run = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateMessageStatus({ isLoading: true });
      updateMessageStatus({ isSending: true });
      const result = await provider?.[
        isDelayed ? "sendMessageDelayed" : "sendMessage"
      ]({
        sender: from,
        recipient: new Address(to),
        amount,
        bounce: overrides?.bounce ?? true,
      });
      updateMessageStatus({ isSent: true });
      console.log(result);

      updateMessageStatus({ isError: false });
      updateMessageStatus({ result });
      updateMessageStatus({ isSuccess: true });
      onComplete?.(result);
    } catch (error) {
      updateMessageStatus({ isError: true });
      updateMessageStatus({ error });
      updateMessageStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateMessageStatus({ isLoading: false });
      updateMessageStatus({ isSending: false });
    }
  }, [provider, args]);

  useEffect(() => {
    if (!messageStatus.isLoading && !messageStatus.isSent) {
      onSettled?.(messageStatus.result, messageStatus.error);
    }
  }, [messageStatus]);

  return { run, messageStatus };
};
