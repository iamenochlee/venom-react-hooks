import { Address, Contract } from "everscale-inpage-provider";
import { SendMessageArgs, SendStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { checkArgs, InitStatus } from "../../helpers";

/**
 * Custom hook for sending an external message using the specified sendArgs.
 * @param sendArgs - The arguments for sending the external message.
 * @returns An object containing a `run` function to initiate the send operation and the status of the send operation.
 * @example
 * const sendArgs = {
 *   address: "0:x1234567890abcdef",
 *   from: "0:xabcdef1234567890",
 *   abi: contractAbi,
 *   publicKey: "publicKey",
 *   functionName: "sendMessage",
 *   args: [message],
 *   overrides: {
 *     value: "1000000000",
 *     bounce: true
 *   },
 *   callType: "sendExternal",
 *   executorParams: "executorParams",
 *   withoutSignature: false,
 *   onComplete: (result) => {
 *     console.log("Message sent:", result);
 *   },
 *   onError: (error) => {
 *     console.error("Error sending message:", error);
 *   },
 *   onSettled: (result, error) => {
 *     console.log("Message send operation settled:", result, error);
 *   }
 * };
 * const { run, status } = useSendExternalMessage(sendArgs);
 * run();
 * console.log(status.isSent); // true if the message was sent successfully
 */

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

  const { status, updateStatus } = InitStatus({
    isLoading: false,
    isSent: false,
  } as SendStatus);

  const { provider } = useVenomProvider();

  const run = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      updateStatus({ isLoading: true });
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateStatus({ isSending: true });

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
      updateStatus({ isSent: true });

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
      updateStatus({ isSending: false });
      updateStatus({ isLoading: false });
    }
  }, Object.values(sendArgs));

  useEffect(() => {
    if (!status.isLoading && status.isSent) {
      onSettled?.(status.result, status.error);
    }
  }, [status]);

  return { run, status };
};
