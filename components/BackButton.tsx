"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-[#4ebdd5] hover:text-[#4ebdd5] font-[700] text-sm transition-colors border-none bg-transparent cursor-pointer p-0"
    >
      <IconArrowLeft size={18} stroke={2.5} />
      Back
    </button>
  );
}
