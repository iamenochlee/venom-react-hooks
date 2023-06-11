import {
  Address,
  FunctionCall,
  ProviderRpcClient,
  SendInternalParams,
} from "everscale-inpage-provider";
import { ReactNode } from "react";
import { VenomConnect } from "venom-connect";

export interface VenomConfigContextValue {
  initVenomConnect: () => Promise<VenomConnect>;
}
export interface VenomConfigProps {
  children: ReactNode;
  initVenomConnect: () => Promise<VenomConnect>;
}

export interface VenomProvider {
  provider: ProviderRpcClient | null;
  setProvider: React.Dispatch<React.SetStateAction<ProviderRpcClient | null>>;
}

export interface Account {
  address: Address;
  publicKey: string;
  contractType: string;
  balance: string;
}

export interface Args {
  abi: AbiType;
  address: string;
  functionName: string;
  args?: {};
}

export interface Overrides {
  value?: string;
  bounce?: boolean;
}
export type CallType = "sendExternal" | "sendDelayed" | "sendExternalDelayed";

export interface MessageCallbacks {
  onComplete?: (data?: any) => void;
  onError?: (error?: Error) => void;
  onSettled?: (data?: any, error?: Error) => void;
}

export interface ExternalMessageArgs extends Args {
  publicKey?: string;
  overrides?: Overrides;
  withoutSignature?: boolean;
  executorParams?: {
    disableSignatureCheck?: boolean | undefined;
    overrideBalance?: string | number | undefined;
  };
}

export interface SendMessageArgs extends ExternalMessageArgs, MessageCallbacks {
  from?: Address;
  callType?: CallType;
}

export interface ReadMessageArgs extends MessageCallbacks, Args {}

export interface ReadMessagesArgs {
  contracts: Args[];
  onComplete?: (data?: any[]) => void;
  onError?: (error?: Error) => void;
  onSettled?: (data?: any[], error?: Error) => void;
}

export interface SendInternalMessageArgs
  extends SendInternalParams,
    MessageCallbacks {
  isDelayed?: boolean;
  to: string;
  payload?: FunctionCall<Address> | undefined;
  overrides?: {
    /**  bounce: defaults to false*/
    bounce: boolean;
  };
}

export interface SignStatus extends BaseStatus {
  isSigned: boolean;
  isSigning?: boolean;
  result?: {
    dataHash?: string;
    signature: string;
    signatureHex: string;
    signatureParts: {
      high: string;
      low: string;
    };
  };
}

export interface SignMessageArgs {
  publicKey: string;
  data: any;
  raw?: boolean;
  withSignatureId?: number | boolean;
  onComplete?: (data?: any) => void;
  onError?: (error?: Error) => void;
  onSettled?: (data?: any, error?: Error) => void;
}

export interface SubscribeArgs {
  address: Address;
  onDataCallback: (data: any) => void;
}
export interface ContractSubscribeArgs {
  abi: AbiType;
  eventName: any;
  address: Address;
  onDataCallback: (data: any) => void;
}

export interface BaseStatus {
  isLoading: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: any;
}

export interface ReadStatus extends BaseStatus {
  data?: any;
  isReading?: boolean;
  isRead: boolean;
  refetch?: () => Promise<void>;
}

export interface ReadsStatus extends BaseStatus {
  data?: any[];
  isReading?: boolean;
  isRead: boolean;
  refetch?: () => Promise<void>;
}

export interface SendStatus extends BaseStatus {
  result?: any;
  isSending?: boolean;
  isSent: boolean;
}

export interface SubscribeStatus {
  isSubscribed: boolean;
  isSubscribing: boolean;
  isError?: boolean;
  error?: Error;
}

export interface AbiType {
  "ABI version": number;
  header: string[];
  functions: {
    name: string;
    inputs: { name: string; type: string }[];
    outputs: { name: string; type: string }[];
  }[];
  data: any[];
  events: any[];
}
