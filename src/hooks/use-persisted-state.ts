import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// `migrate` (optional) transforms a stored value when it is loaded, e.g. to
// upgrade data saved by an older version of the app.
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  migrate?: (stored: T) => T,
) {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((stored) => {
      if (stored != null) {
        const parsed: T = JSON.parse(stored);
        setState(migrate ? migrate(parsed) : parsed);
      }
      setIsLoaded(true);
    });
    // `migrate` is only applied on the initial load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(key, JSON.stringify(state));
  }, [key, state, isLoaded]);

  return [state, setState] as const;
}
