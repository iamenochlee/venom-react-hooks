import { Address, Contract } from "everscale-inpage-provider";
import { ReadMessageArgs, ReadStatus } from "../../types";
import { useCallback, useEffect } from "react";
import { useVenomProvider } from "../../context/VenomProvider";
import { InitStatus } from "../../helpers/InitStatus";

/**
 * Custom hook for reading data from a smart contract.
 * @param readArgs - The arguments for reading the message.
 * @returns The status of the read operation.
 * @example
 * const readArgs = {
 *   address: "0x1234567890abcdef",
 *   abi: contractAbi,
 *   functionName: "getMessage",
 *   args?: []
 * };
 * const status = useReadMessage(readArgs);
 * console.log(status.data); // Retrieved data
 */

export const useReadMessage = (readArgs: ReadMessageArgs) => {
  const { address, abi, functionName, args, onComplete, onError, onSettled } =
    readArgs;

  const { status, updateStatus } = InitStatus({
    isRead: false,
    isLoading: false,
  } as ReadStatus);

  const { provider } = useVenomProvider();

  const fetchData = useCallback(async () => {
    try {
      if (!provider) throw new Error("No Provider");
      const contractAddress = new Address(address);
      const contract = new Contract(provider, abi, contractAddress);

      updateStatus({ isLoading: true });
      updateStatus({ isReading: true });

      const data = (await contract.methods[functionName](
        args as never
      ).call()) as any;

      updateStatus({ isRead: true });
      updateStatus({ isError: false });
      updateStatus({ data });
      updateStatus({ isSuccess: true });
      onComplete?.(data);
    } catch (error) {
      updateStatus({ error: error });
      updateStatus({ isError: true });

      updateStatus({ isSuccess: false });
      onError?.(error as Error);
    } finally {
      updateStatus({ isLoading: false });
      updateStatus({ isReading: false });
    }
  }, Object.values(readArgs));

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    refetch();
    updateStatus({ refetch: fetchData });
  }, []);

  useEffect(() => {
    if (!status.isLoading && !status.isReading) {
      onSettled?.(status.data, status.error);
    }
  }, [status]);

  return status;
};
