import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

interface Account {
  address: string | undefined;
  balance: string | undefined;
}

interface AccountContext {
  account: Account | null;
  setAccount: Dispatch<React.SetStateAction<Account | null>>;
}

const defaultContext: AccountContext = {
  account: null,
  setAccount: () => undefined,
};
const AccountContext = createContext<AccountContext>(defaultContext);

export const ProviderContext = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  return useContext(AccountContext);
};
