import { Address, Contract } from "everscale-inpage-provider";
import { Args, ReadMessageStatus } from "../types";
import { Reducer, useCallback, useEffect, useReducer } from "react";
import { useVenomProvider } from "../context/VenomProvider";

interface MessageRead extends Args {
  onComplete?: (data?: any) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: any | null, error: Error | null) => void;
}

const initialStatus: ReadMessageStatus = {};

export const useContractRead = ({
  address,
  abi,
  functionName,
  args,
  onComplete,
  onError,
  onSettled,
}: MessageRead) => {
  const [messageStatus, updateMessageStatus] = useReducer<
    Reducer<ReadMessageStatus, Partial<ReadMessageStatus>>
  >((currentState, updatedState) => {
    return { ...currentState, ...updatedState };
  }, initialStatus);
  const { provider } = useVenomProvider();

  const fetchData = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateMessageStatus({ isFetching: true });

      const data = (await contract.methods[functionName](
        args as never
      ).call()) as any;

      updateMessageStatus({ isError: false });
      updateMessageStatus({ data });
      updateMessageStatus({ isSuccess: true });
      onComplete?.(data);
    } catch (error) {
      updateMessageStatus({ isError: true });
      updateMessageStatus({ error });
      updateMessageStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateMessageStatus({ isFetching: false });
    }
  }, [provider, address, abi, functionName, args, onComplete, onError]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    refetch();
    updateMessageStatus({ refetch: fetchData });
  }, []);

  useEffect(() => {
    onSettled?.(messageStatus.data, null);
  }, [messageStatus.isFetching]);

  return messageStatus;
};
