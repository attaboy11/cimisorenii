"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trivia } from "@/lib/seededData";

export default function TriviaPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const questions = useMemo(() => trivia.questions.slice(0, 10), []);
  const current = questions[index];

  function answer(idx: number) {
    if (idx === current.answerIndex) setScore((s) => s + 1);
    if (index + 1 >= questions.length) setFinished(true);
    else setIndex((i) => i + 1);
  }

  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold mb-2">Trivia quick game</h1>
        {finished ? (
          <div>
            <p className="text-lg">Final score: {score}/{questions.length}</p>
            <p className="text-sm text-slate-400">Leaderboard stored in Prisma seed.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Category: {current.club} · Difficulty: {current.difficulty}</p>
            <p className="font-semibold text-lg">{current.question}</p>
            <div className="grid gap-2">
              {current.options.map((opt, idx) => (
                <Button key={idx} onClick={() => answer(idx)} className="text-left">{opt}</Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">Source: {current.sourceName}</p>
          </div>
        )}
      </Card>
    </main>
  );
}
