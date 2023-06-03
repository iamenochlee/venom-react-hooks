export interface Overrides {
  value?: string;
  bounce?: boolean;
}

export interface Account {
  address: string | undefined;
  balance: string | undefined;
}

export interface Args {
  abi: DePoolAbiType;
  address: string;
  functionName: string;
  args?: {};
}
export interface ExternalMessageArgs extends Args {
  overrides?: Overrides;
}

export interface MessageStatus {
  data?: any;
  error?: any;
  isFetching?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export interface ReadMessageStatus extends MessageStatus {
  refetch?: () => Promise<void>;
}

export interface DePoolAbiType {
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
