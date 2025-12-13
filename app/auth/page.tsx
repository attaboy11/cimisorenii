"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const inviteCodes = ["FOOTYCREW", "VILLA4LIFE", "GUNNERS"];

export default function AuthPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold">Invite code login</h1>
        <p className="text-sm text-slate-400">Private-ish access for the crew.</p>
        <div className="flex gap-2 mt-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            placeholder="Enter invite code"
          />
          <Button
            onClick={() => {
              if (inviteCodes.includes(code.trim().toUpperCase())) {
                localStorage.setItem("banterboard_invite", code.trim());
                setStatus("Access granted for this browser session.");
              } else {
                setStatus("Nope. Ask the owner for a valid code.");
              }
            }}
          >
            Enter
          </Button>
        </div>
        {status && <p className="text-sm mt-2 text-slate-300">{status}</p>}
      </Card>
    </main>
  );
}
