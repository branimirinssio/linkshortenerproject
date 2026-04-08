"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function HeroCta() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton mode="modal">
        <Button size="lg" className="px-8">
          Get Started Free
        </Button>
      </SignUpButton>
    </div>
  );
}
