import { Address } from "everscale-inpage-provider";
import { useConnect } from "./hooks/useConnect";
import { useSendMessage } from "./hooks/useSendMessage";
import { formatNano, toNano } from "./utils";
import Interact from "./components/Interact";
import { addAsset } from "./helpers/addAsset";

const App = () => {
  const { login, disconnect, isConnected, account, venomConnect } =
    useConnect();
  const { run, messageStatus } = useSendMessage({
    from: account?.address as Address,
    to: "0:d0889f22a6beeb1174ade5bb6c0f8ce5be84a985f759e5e0e30aab0adb84de22",
    amount: toNano(0.5),
    onSettled: () => {
      console.log(messageStatus);
    },
  });

  const { add } = addAsset(
    account?.address.toString(),
    "0:5d36085315dc7cbf546ee145e7241ef813f2c4938db94c60eac328ccf7ddae5a"
  );

  return (
    <div>
      <button onClick={() => login().catch(console.error)}>
        Connect Wallet
      </button>
      <button onClick={add}>Add Token</button>
      <button onClick={() => venomConnect?.updateTheme("light")}>
        Change Theme
      </button>
      <button onClick={disconnect}>Disconnect</button>
      <p>{account?.address?.toString()}</p>
      {account?.balance && <p>{formatNano(account?.balance as string)}</p>}
      <button onClick={run}>Send</button>
      {isConnected && (
        <Interact wallet={account?.address?.toString() as string} />
      )}
    </div>
  );
};

export default App;
