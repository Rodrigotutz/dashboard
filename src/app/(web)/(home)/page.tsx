"use client";
import { useEffect } from "react";
import MainHeader from "./main-header";
import { DashboardLanding } from "./DashboardLanding";
export default function Page() {
  useEffect(() => {});

  return (
    <div>
      <MainHeader />

      <DashboardLanding />
    </div>
  );
}
