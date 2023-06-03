import { Address, Transaction } from "everscale-inpage-provider";
import { useState } from "react";
import { useVenomProvider } from "../context/VenomProvider";

export const useSendTransaction = (
  sender: Address,
  to: string,
  amount: string
) => {
  const { provider } = useVenomProvider();
  const [status, setStatus] = useState<Transaction<Address>>();

  async function run() {
    const _status = await provider?.sendMessage({
      sender,
      recipient: new Address(to),
      amount,
      bounce: false,
    });
    setStatus(_status?.transaction);
    console.log(_status);
  }

  return { run };
};
