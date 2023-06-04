import { Address, Contract } from "everscale-inpage-provider";
import { SendMessageArgs, SendStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { checkArgs, InitMessageStatus } from "../../helpers";

const initialStatus: SendStatus = {
  isLoading: false,
  isSent: false,
};

export const useSendExternalMessage = (sendArgs: SendMessageArgs) => {
  const {
    address,
    from,
    abi,
    publicKey,
    functionName,
    args,
    overrides,
    callType,
    executorParams,
    withoutSignature,
    onComplete,
    onError,
    onSettled,
  } = sendArgs;

  const { messageStatus, updateMessageStatus } =
    InitMessageStatus(initialStatus);
  const { provider } = useVenomProvider();

  const run = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateMessageStatus({ isLoading: true });
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateMessageStatus({ isSending: true });

      let result;

      switch (callType) {
        case "sendExternal":
          checkArgs(
            [publicKey, executorParams],
            "SendExternal: invalid values for 'publicKey' and 'executorParams'"
          );

          result = await contract.methods[functionName](
            args as never
          ).sendExternal({
            publicKey: publicKey as string,
            withoutSignature: withoutSignature || false,
            executorParams: executorParams,
          });
          break;

        case "sendDelayed":
          checkArgs([from], "SendDelayed: invalid value for 'from'");
          result = await contract.methods[functionName](
            args as never
          ).sendDelayed({
            from: from as unknown as Address,
            amount: overrides?.value ?? "0",
            bounce: overrides?.bounce ?? true,
          });
          break;

        case "sendExternalDelayed":
          checkArgs([publicKey], "SendExternal: invalid value for 'publicKey'");
          result = await contract.methods[functionName](
            args as never
          ).sendExternalDelayed({
            publicKey: publicKey as string,
          });
          break;

        default:
          checkArgs([from], "Send: invalid value for 'from'");
          result = await contract.methods[functionName](args as never).send({
            from: from as unknown as Address,
            amount: overrides?.value ?? "0",
            bounce: overrides?.bounce ?? true,
          });
          break;
      }
      updateMessageStatus({ isSent: true });

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
      updateMessageStatus({ isSending: false });
      updateMessageStatus({ isLoading: false });
    }
  }, Object.values(sendArgs));

  useEffect(() => {
    if (!messageStatus.isLoading && !messageStatus.isSent) {
      onSettled?.(messageStatus.result, messageStatus.error);
    }
  }, [messageStatus]);

  return { run, messageStatus };
};
