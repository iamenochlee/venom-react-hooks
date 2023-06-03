import { Address } from "everscale-inpage-provider";
import { useConnect } from "./hooks/useConnect";
import { useSendTransaction } from "./hooks/useSendTransaction";
import { asVenom, toNano } from "./utils";
import Interact from "./components/Interact";

const App = () => {
  const { login, disconnect, isConnected, account } = useConnect();
  console.log(account);

  const { run } = useSendTransaction(
    new Address(account?.address as string),
    "0:d0889f22a6beeb1174ade5bb6c0f8ce5be84a985f759e5e0e30aab0adb84de22",
    toNano(0.5)
  );

  return (
    <div>
      <button onClick={() => login().catch(console.error)}>
        Connect Wallet
      </button>
      <button onClick={disconnect}>Disconnect</button>
      <p>{account?.address}</p>
      <p>{asVenom(account?.balance as string)}</p>
      <button onClick={run}>Send</button>
      {isConnected && <Interact wallet={account?.address as string} />}
    </div>
  );
};

export default App;
