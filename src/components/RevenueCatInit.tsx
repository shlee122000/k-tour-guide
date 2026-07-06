"use client";

import { useEffect } from "react";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

export default function RevenueCatInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const apiKey = Capacitor.getPlatform() === "ios"
        ? "appl_gUOKSNkkvuoGaTwSGNdNAZbutgJ"
        : "goog_gVFREfdvkVkKWbhdRDqyqEeECCk";

    Purchases.configure({ apiKey });
  }, []);

  return null;
}