import { ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { VenomConnect } from "venom-connect";

export const initVenomConnect = async () => {
  return new VenomConnect({
    theme: "dark",
    checkNetworkId: 0,
    providersOptions: {
      venomwallet: {
        links: {
          extension: [
            {
              browser: "chrome",
              link: "lol",
            },
          ],
          android: undefined,
          ios: null,
        },
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
                    id: 10,
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
