"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function AppDataRefreshListener() {
  const router = useRouter();
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );
  const previousToggle = useRef(refreshToggle);

  useEffect(() => {
    if (previousToggle.current === refreshToggle) return;

    previousToggle.current = refreshToggle;
    router.refresh();
  }, [refreshToggle, router]);

  return null;
}
