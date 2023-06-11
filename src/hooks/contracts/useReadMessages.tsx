import { Address, Contract } from "everscale-inpage-provider";
import { Args, ReadMessagesArgs, ReadsStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { InitStatus } from "../../helpers/InitStatus";

/**
 * Custom hook for reading data from multiple smart contracts.
 * @param readArgs - The arguments for reading the messages.
 * @returns The status of the read operation.
 * @example
 * const readArgs = {
 *   contracts: [
 *     {
 *       address: "0:x1234567890abcdef",
 *       abi: contractAbi1,
 *       functionName: "getMessage",
 *       args: []
 *     },
 *     {
 *       address: "0:xabcdef1234567890",
 *       abi: contractAbi2,
 *       functionName: "getValue",
 *       args: []
 *     }
 *   ]
 * };
 * const status = useReadMessages(readArgs);
 * console.log(status.data); // Retrieved data from all contracts
 */

export const useReadMessages = (readArgs: ReadMessagesArgs) => {
  const { contracts, onComplete, onError, onSettled } = readArgs;

  const { status, updateStatus } = InitStatus({
    isRead: false,
    isLoading: false,
  } as ReadsStatus);

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
    [provider, onComplete, onError, updateStatus]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateStatus({ isLoading: true });
        const fetchDataPromises = contracts.map(fetch);
        updateStatus({ isReading: true });
        await Promise.all(fetchDataPromises).then((data) => {
          updateStatus({ isError: false });
          updateStatus({ isRead: true });
          updateStatus({ data });
          updateStatus({ isSuccess: true });
          onComplete?.(data);
        });
      } catch (error) {
        console.log(error);

        updateStatus({ error: error });
        updateStatus({ isError: true });
        updateStatus({ isSuccess: false });
        onError?.(error as Error);
      } finally {
        updateStatus({ isLoading: false });
        updateStatus({ isReading: false });
      }
    };

    fetchData();
    updateStatus({ refetch: fetchData });
  }, []);

  useEffect(() => {
    if (!status.isLoading && !status.isReading) {
      onSettled?.(status.data, status.error);
    }
  }, [status]);

  return status;
};
