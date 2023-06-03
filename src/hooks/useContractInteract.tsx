import { Address, Contract, Transaction } from "everscale-inpage-provider";
import { ExternalMessageArgs, ReadMessageStatus } from "../types";
import { Reducer, useCallback, useEffect, useReducer } from "react";
import { useVenomProvider } from "../context/VenomProvider";

interface MessageSend extends ExternalMessageArgs {
  sender: string;
  onComplete?: (data?: any) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: any | null, error: Error | null) => void;
}

const initialStatus: ReadMessageStatus = {};

export const useContractInteract = ({
  address,
  sender,
  abi,
  functionName,
  args,
  overrides,
  onComplete,
  onError,
  onSettled,
}: MessageSend) => {
  const [messageStatus, updateMessageStatus] = useReducer<
    Reducer<ReadMessageStatus, Partial<ReadMessageStatus>>
  >((currentState, updatedState) => {
    return { ...currentState, ...updatedState };
  }, initialStatus);
  const { provider } = useVenomProvider();

  const run = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateMessageStatus({ isFetching: true });

      const result = (await contract.methods[functionName](args as never).send({
        from: new Address(sender),
        amount: overrides?.value ?? "0",
        bounce: overrides?.bounce ?? true,
      })) as Transaction;

      if (result?.id?.lt && result?.endStatus === "active") {
        updateMessageStatus({ isError: false });
        updateMessageStatus({ data: result });
        updateMessageStatus({ isSuccess: true });
        onComplete?.(result);
      }
    } catch (error) {
      updateMessageStatus({ isError: true });
      updateMessageStatus({ error });
      updateMessageStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateMessageStatus({ isFetching: false });
    }
  }, [provider, address, abi, functionName, args, onComplete, onError]);

  useEffect(() => {
    onSettled?.(messageStatus.data, null);
  }, [messageStatus.isFetching]);

  return { run, messageStatus };
};
