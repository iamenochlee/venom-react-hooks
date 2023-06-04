import { Address, Contract } from "everscale-inpage-provider";
import { Args, ReadMessagesArgs, ReadStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { InitMessageStatus } from "../../helpers/InitMessageStatus";

const initialStatus: ReadStatus = {
  isRead: false,
  isLoading: false,
};

export const useReadMessages = (readArgs: ReadMessagesArgs) => {
  const { contracts, onComplete, onError, onSettled } = readArgs;

  const { messageStatus, updateMessageStatus } =
    InitMessageStatus(initialStatus);

  const { provider } = useVenomProvider();

  const fetch = useCallback(
    async (contractArgs: Args) => {
      const { address, abi, functionName, args } = contractArgs;
      if (!provider) throw new Error("No Provider");
      const contractAddress = new Address(address);

      const contract = new Contract(provider, abi, contractAddress);
      const data = (await contract.methods[functionName](
        args as never
      ).call()) as any;

      return data;
    },
    [provider, onComplete, onError, updateMessageStatus]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateMessageStatus({ isLoading: true });
        const fetchDataPromises = contracts.map(fetch);
        updateMessageStatus({ isReading: true });
        await Promise.all(fetchDataPromises).then((data) => {
          updateMessageStatus({ isError: false });
          updateMessageStatus({ isRead: true });
          updateMessageStatus({ data });
          updateMessageStatus({ isSuccess: true });
          onComplete?.(data);
        });
      } catch (error) {
        console.log(error);

        updateMessageStatus({ error: error });
        updateMessageStatus({ isError: true });
        updateMessageStatus({ isSuccess: false });
        onError?.(error as Error);
      } finally {
        updateMessageStatus({ isLoading: false });
        updateMessageStatus({ isReading: false });
      }
    };

    fetchData();
    updateMessageStatus({ refetch: fetchData });
  }, []);

  useEffect(() => {
    if (!messageStatus.isLoading && !messageStatus.isReading) {
      onSettled?.(messageStatus.data, messageStatus.error);
    }
  }, [messageStatus]);

  return messageStatus;
};
