"use client";

import { getCurrentUser } from "@/api-services/auth.api.services";
import type { CurrentUser } from "@/types/auth.type";
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CurrentUserContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

export const CurrentUserContext = createContext<
  CurrentUserContextValue | undefined
>(undefined);

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (requestError) {
      setUser(null);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <CurrentUserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
