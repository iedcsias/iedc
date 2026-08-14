"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash && (hash.toLowerCase().startsWith("iedc-") || hash.toLowerCase().startsWith("clb-"))) {
        router.replace(`/leads#${hash}`);
      }
    }
  }, [router]);

  return null;
}
