"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  customerOnly?: boolean;
  guestOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  customerOnly = false,
  guestOnly = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly) {
      if (user) {
        router.replace(user.role === "admin" ? "/admin" : "/");
      }
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (adminOnly && user.role !== "admin") {
      router.replace("/");
      return;
    }

    if (customerOnly && user.role !== "customer") {
      router.replace(user.role === "admin" ? "/admin" : "/");
    }
  }, [adminOnly, customerOnly, guestOnly, isLoading, router, user]);

  if (
    isLoading ||
    (guestOnly && user) ||
    (!guestOnly &&
      (!user ||
        (adminOnly && user.role !== "admin") ||
        (customerOnly && user.role !== "customer")))
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Checking your access...
      </div>
    );
  }

  return children;
}
