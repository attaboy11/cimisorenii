"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateRoasts, toneGuard } from "@/lib/banterEngine";
import { clubs, banterPacks } from "@/lib/seededData";
import { format } from "date-fns";

const reactions = ["😂", "🤡", "🧂", "🧠"];

export default function BanterPage() {
  const [target, setTarget] = useState("Arsenal");
  const [rival, setRival] = useState("Manchester United");
  const [intensity, setIntensity] = useState<"mild" | "medium" | "savage">("medium");
  const [style, setStyle] = useState<"dry" | "absurd" | "statistical" | "poetic">("dry");
  const [post, setPost] = useState("");
  const roasts = useMemo(() => generateRoasts({ target, rival, intensity, style }), [target, rival, intensity, style]);
  const guard = toneGuard(post);
  const feed = banterPacks.map((pack) => ({
    id: pack.id,
    author: "Maya",
    content: pack.entries[0],
    reactions: reactions,
    createdAt: new Date(),
  }));
  return (
    <main className="space-y-6">
      <Card>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Roast Generator</h1>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-sm">Target club
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                {clubs.map((c) => (
                  <option key={c.code}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">Rival club
              <select value={rival} onChange={(e) => setRival(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                {clubs.filter((c) => c.name !== target).map((c) => (
                  <option key={c.code}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-sm">Intensity
              <select value={intensity} onChange={(e) => setIntensity(e.target.value as any)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                <option value="mild">mild</option>
                <option value="medium">medium</option>
                <option value="savage">savage</option>
              </select>
            </label>
            <label className="text-sm">Style
              <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                <option value="dry">dry</option>
                <option value="absurd">absurd</option>
                <option value="statistical">statistical</option>
                <option value="poetic">poetic</option>
              </select>
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {roasts.variants.map((r, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/60">
                <p>{r}</p>
                <Button className="mt-2" onClick={() => navigator.clipboard.writeText(r)}>Share</Button>
              </div>
            ))}
            <div className="p-3 rounded-lg bg-slate-800/60">
              <p className="font-semibold">Self roast</p>
              <p>{roasts.selfRoast}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400">Daily seed ensures deterministic banter for the day.</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Post to banter feed</h2>
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 h-24"
          placeholder="Drop your roast (tone guard active)"
        />
        {!guard.ok && <p className="text-red-300 text-sm">Tone guard blocked term: {guard.term}. Please rephrase.</p>}
        <Button className="mt-2" disabled={!guard.ok || post.length < 5}>Post</Button>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Banter feed</h2>
          <Badge label="Tone guard on" />
        </div>
        <div className="space-y-3">
          {feed.map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-slate-800/60">
              <div className="flex justify-between text-sm text-slate-400">
                <span>{item.author}</span>
                <span>{format(item.createdAt, "dd MMM HH:mm")}</span>
              </div>
              <p className="font-semibold">{item.content}</p>
              <div className="flex gap-2 mt-1">
                {item.reactions.map((r) => (
                  <span key={r} className="text-lg">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
