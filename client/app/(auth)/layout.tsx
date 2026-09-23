import Footer from "@/components/sections/footer";
import Header from "@/components/shared/header";
import ProtectedRoute from "@/components/auth/protected-route";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function layout({ children }: Props) {
  return (
    <ProtectedRoute guestOnly>
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default layout;
