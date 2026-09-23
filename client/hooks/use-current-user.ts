"use client";

import { CurrentUserContext } from "@/providers/current-user-provider";
import { useContext } from "react";

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
}
