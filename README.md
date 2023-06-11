## Venom React Hooks

This project is a submission for Venom Foundation [Hackation](https://hackathon.venom.network/)

Venom React Hooks provides easily customizable hooks for connecting, reading, sending messages, and subscribing to messages on the Venom Network.

Build your frontends Faster.

### Demo

Try it out on replit: [Example](https://replit.com/@EnochAkinbode/Venom-Hooks)

### Installation

`npm i venom-react-hooks everscale-inpage-provider everscale-standalone-client venom-connect`

Venom React hooks utilizes [venom-connect](https://github.com/web3sp/venom-connect), [everscale-standalone-client](https://github.com/broxus/everscale-standalone-client), [everscale-inpage-provider](https://github.com/broxus/everscale-inpage-provider) to provide an interface for interacting with the network from the frontend.

### Usage

#### - Configuration

For venom-react-hooks to function you need to provide a venom connect configuration to the `VenomConfig` context, which should be wrapped around your `<App />` component.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { VenomConnect } from "venom-connect";
//import the config provider
import { VenomConfig } from "venom-react-hooks";


export const initVenomConnect = async () => {
  return new VenomConnect({
    theme: "dark",
    checkNetworkId: 1000,
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("venomwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: () =>
                EverscaleStandaloneClient.create({
                  connection: {
                    id: 1000,
                    group: "venom_testnet",
                    type: "jrpc",
                    data: {
                      endpoint: "https://jrpc-testnet.venom.foundation/rpc",
                    },
                  },
                }),
              forceUseFallback: true,
            },

            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: ["mobile", "ios", "android"],
      },
    },
  });
};


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <VenomConfig initVenomConnect={initVenomConnect}>
      <App />
    </VenomConfig>
  </React.StrictMode>
);

```

#### - Importing

```js
import {
  useConnect,
  useContractReads,
  useContractSubscription,
  useSendExternalMessage,
} from "venom-react-hooks";
```

`useConnect` provides functions for connecting to the wallets, it utilizes Venom-Connect.
It provides an account object containing the details of the connected account.

```js
const { isConnected, connect, disconnect, account } = useConnect();
```

`useSendMessage` sends a message to the venom network.

```js
const { run, status } = useSendMessage({
  from: new Address("0:x54665788766fdd7.."),
  to: "0:4546ea46787...",
  amount: "100",
  // other arguments...
});
```

`useReadMessage` peforms a call request to a contract on the venom network.

```js
const readStatus = useReadMessage({
  address: "0:x1234567890abcdef...",
  abi: contractAbi1,
  functionName: "getMessage",
  args: [],
});
```

`useContractSubscription` watches for changes relating to an event in a contract.

```js
const { status } = useContractSubscription({
  provider: venomProvider,
  abi: contractAbi,
  eventName: "Transfer",
  address: "0:x1234567890abcdef...",
  onDataCallback: (data) => {
    console.log("Received event data:", data);
  },
});
```

### More Hooks

- useReadMessages
- useSignMessage
- useSubscribe
