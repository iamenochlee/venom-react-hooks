import { useState } from "react";
import tokenRootAbi from "../../constants/TokenRoot.abi.json";
import tokenSaleAbi from "../../constants/Tokensale.abi.json";
import { useContractRead } from "../hooks/useContractRead";
import { Address } from "everscale-inpage-provider";
import { useContractInteract } from "../hooks/useContractInteract";
import { toNano } from "../utils";

const Interact = ({ wallet }: { wallet: string }) => {
  const [userTokenWallet, setUserTokenWallet] = useState<string>();

  const contractRead = useContractRead({
    abi: tokenRootAbi,
    address:
      "0:5d36085315dc7cbf546ee145e7241ef813f2c4938db94c60eac328ccf7ddae5a",
    functionName: "walletOf",
    args: {
      answerId: 0,
      walletOwner: new Address(wallet),
    },
    onComplete: (data) => {
      setUserTokenWallet(data.value0._address);
    },
    onSettled: () => {
      console.log(contractRead);
    },
  });

  // const { refetch: check } = useContractRead({
  //   abi: tokenWalletAbi,
  //   address,
  //   functionName: "balance",
  //   args: {
  //     answerId: 0,
  //   },
  // });

  const { run } = useContractInteract({
    abi: tokenSaleAbi,
    sender: wallet,
    address:
      "0:586f40fb80c0819609c6c697fef9fa55ceb1afb55d549d8e06b7ba42708f9482",
    functionName: "buyTokens",
    args: {
      deposit: toNano("11"),
    },
    onComplete: (data) => {
      console.log(data, "data value");
    },
    overrides: {
      value: toNano("10"),
    },
  });

  return (
    <div>
      Interact
      <button onClick={contractRead.refetch}>Check</button>
      <button>Balance</button>
      <p>{userTokenWallet}</p>
      <button onClick={run}>RUN</button>
    </div>
  );
};

export default Interact;

//a root creates a wallet for a uset, if may/may not be deployed that is the contract representing thw wallet, i need to check it state b4 calling functions on it

//hooks for Token Wallet

//root: 0:5d36085315dc7cbf546ee145e7241ef813f2c4938db94c60eac328ccf7ddae5a
//sale: 0:586f40fb80c0819609c6c697fef9fa55ceb1afb55d549d8e06b7ba42708f9482
