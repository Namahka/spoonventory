import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { STORAGE_KEYS } from "@/constants/storage";
import { hashValue } from "@/lib/hash";

interface Account {
  name: string;
  passwordHash: string;
}

interface AppLock {
  enabled: boolean;
  pinHash?: string;
}

interface AuthContextValue {
  isLoading: boolean;
  account: Account | null;
  isLoggedIn: boolean;
  appLock: AppLock;
  isUnlocked: boolean;
  createAccount: (name: string, password: string) => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setAppLock: (enabled: boolean, pin?: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  updateName: (name: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  changePin: (currentPin: string, newPin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_APP_LOCK: AppLock = { enabled: false };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appLock, setAppLockState] = useState<AppLock>(DEFAULT_APP_LOCK);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.account),
      AsyncStorage.getItem(STORAGE_KEYS.isLoggedIn),
      AsyncStorage.getItem(STORAGE_KEYS.appLock),
    ]).then(([storedAccount, storedIsLoggedIn, storedAppLock]) => {
      if (storedAccount) setAccount(JSON.parse(storedAccount));
      if (storedIsLoggedIn) setIsLoggedIn(JSON.parse(storedIsLoggedIn));
      if (storedAppLock) setAppLockState(JSON.parse(storedAppLock));
      setIsLoading(false);
    });
  }, []);

  const createAccount = async (name: string, password: string) => {
    const passwordHash = await hashValue(password);
    const newAccount: Account = { name: name.trim(), passwordHash };
    await AsyncStorage.setItem(
      STORAGE_KEYS.account,
      JSON.stringify(newAccount),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.isLoggedIn, JSON.stringify(true));
    setAccount(newAccount);
    setIsLoggedIn(true);
    setIsUnlocked(true);
  };

  const login = async (password: string) => {
    if (!account) return false;
    const passwordHash = await hashValue(password);
    if (passwordHash !== account.passwordHash) return false;
    await AsyncStorage.setItem(STORAGE_KEYS.isLoggedIn, JSON.stringify(true));
    setIsLoggedIn(true);
    setIsUnlocked(true);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.isLoggedIn, JSON.stringify(false));
    setIsLoggedIn(false);
    setIsUnlocked(false);
  };

  const setAppLock = async (enabled: boolean, pin?: string) => {
    const next: AppLock = enabled
      ? { enabled: true, pinHash: await hashValue(pin ?? "") }
      : { enabled: false };
    await AsyncStorage.setItem(STORAGE_KEYS.appLock, JSON.stringify(next));
    setAppLockState(next);
  };

  const unlock = async (pin: string) => {
    if (!appLock.pinHash) return false;
    const pinHash = await hashValue(pin);
    if (pinHash !== appLock.pinHash) return false;
    setIsUnlocked(true);
    return true;
  };

  const updateName = async (name: string) => {
    if (!account) return;
    const updated: Account = { ...account, name: name.trim() };
    await AsyncStorage.setItem(STORAGE_KEYS.account, JSON.stringify(updated));
    setAccount(updated);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!account) return false;
    const currentHash = await hashValue(currentPassword);
    if (currentHash !== account.passwordHash) return false;
    const updated: Account = {
      ...account,
      passwordHash: await hashValue(newPassword),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.account, JSON.stringify(updated));
    setAccount(updated);
    return true;
  };

  const changePin = async (currentPin: string, newPin: string) => {
    if (!appLock.pinHash) return false;
    const currentHash = await hashValue(currentPin);
    if (currentHash !== appLock.pinHash) return false;
    const updated: AppLock = { enabled: true, pinHash: await hashValue(newPin) };
    await AsyncStorage.setItem(STORAGE_KEYS.appLock, JSON.stringify(updated));
    setAppLockState(updated);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        account,
        isLoggedIn,
        appLock,
        isUnlocked,
        createAccount,
        login,
        logout,
        setAppLock,
        unlock,
        updateName,
        changePassword,
        changePin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
