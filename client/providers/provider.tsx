"use client";
import AiButton from "@/components/ui/ai-button";
import AppDataRefreshListener from "@/components/shared/app-data-refresh-listener";
import { CurrentUserProvider } from "@/providers/current-user-provider";
import { store } from "@/redux/store";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
interface Props {
  children: React.ReactNode;
}
function Provider({ children }: Props) {
  return (
    <div>
      <ReduxProvider store={store}>
        <CurrentUserProvider>
          <AppDataRefreshListener />
          {children}
          <AiButton />
        </CurrentUserProvider>
      </ReduxProvider>
    </div>
  );
}

export default Provider;
