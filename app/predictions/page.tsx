"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fixtures, clubs } from "@/lib/seededData";
import { format } from "date-fns";

export default function PredictionsPage() {
  const upcoming = fixtures.filter((f) => f.kickoffTs > new Date()).slice(0, 6);
  const [preds, setPreds] = useState<Record<string, { home: number; away: number }>>({});
  const leaderboard = clubs.map((c, idx) => ({ name: c.name + " fan", points: 10 - idx }));
  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold mb-3">Predictions</h1>
        <div className="space-y-3">
          {upcoming.map((fixture) => (
            <div key={fixture.id} className="bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{fixture.homeClub} vs {fixture.awayClub}</p>
                  <p className="text-xs text-slate-400">{format(fixture.kickoffTs, "EEE dd MMM HH:mm")} · {fixture.competition}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={10} className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1" placeholder="H"
                    onChange={(e) => setPreds({ ...preds, [fixture.id]: { home: Number(e.target.value), away: preds[fixture.id]?.away ?? 0 } })} />
                  <span>-</span>
                  <input type="number" min={0} max={10} className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1" placeholder="A"
                    onChange={(e) => setPreds({ ...preds, [fixture.id]: { home: preds[fixture.id]?.home ?? 0, away: Number(e.target.value) } })} />
                  <Button className="ml-2" onClick={() => alert("Prediction stored locally for demo")}>Save</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold mb-2">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((row, idx) => (
            <div key={row.name} className="flex justify-between bg-slate-800/60 rounded-lg px-3 py-2">
              <span>#{idx + 1} {row.name}</span>
              <span className="font-semibold">{row.points} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
