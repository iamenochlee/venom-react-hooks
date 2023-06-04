import { Address, Contract } from "everscale-inpage-provider";
import { ReadMessageArgs, ReadStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { InitMessageStatus } from "../../helpers/InitMessageStatus";

const initialStatus: ReadStatus = {
  isRead: false,
  isLoading: false,
};

export const useReadMessage = (readArgs: ReadMessageArgs) => {
  const { address, abi, functionName, args, onComplete, onError, onSettled } =
    readArgs;

  const { messageStatus, updateMessageStatus } =
    InitMessageStatus(initialStatus);

  const { provider } = useVenomProvider();

  const fetchData = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateMessageStatus({ isLoading: true });
      updateMessageStatus({ isReading: true });

      const data = (await contract.methods[functionName](
        args as never
      ).call()) as any;

      updateMessageStatus({ isRead: true });
      updateMessageStatus({ isError: false });
      updateMessageStatus({ data });
      updateMessageStatus({ isSuccess: true });
      onComplete?.(data);
    } catch (error) {
      updateMessageStatus({ error: error });
      updateMessageStatus({ isError: true });

      updateMessageStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateMessageStatus({ isLoading: false });
      updateMessageStatus({ isReading: false });
    }
  }, Object.values(readArgs));

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    refetch();
    updateMessageStatus({ refetch: fetchData });
  }, []);

  useEffect(() => {
    if (!messageStatus.isLoading && !messageStatus.isReading) {
      onSettled?.(messageStatus.data, messageStatus.error);
    }
  }, [messageStatus]);

  return messageStatus;
};
