import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clubs, fixtures, facts } from "@/lib/seededData";
import { generateRoasts } from "@/lib/banterEngine";
import Link from "next/link";
import { format } from "date-fns";

export default function HomePage() {
  const headline = generateRoasts({
    target: "Arsenal",
    rival: "Manchester United",
    intensity: "medium",
    style: "dry",
  }).variants[0];
  const nextFixtures = clubs.map((club) =>
    fixtures
      .filter((f) => f.homeClub === club.name || f.awayClub === club.name)
      .filter((f) => f.kickoffTs > new Date())
      .sort((a, b) => a.kickoffTs.getTime() - b.kickoffTs.getTime())[0]
  );
  const thisDay = facts[3];
  const nextEvent = { title: "Derby watch at The Crown", date: format(new Date(Date.now() + 3 * 86400000), "EEE dd MMM"), location: "Shoreditch" };
  return (
    <main className="space-y-6">
      <section className="card bg-slate-900/60 flex flex-col gap-2">
        <p className="text-xs uppercase text-slate-400">Today's Banter Headline</p>
        <h1 className="text-2xl font-bold">{headline}</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigator.clipboard.writeText(headline)}>Share</Button>
          <Link href="/banter" className="text-sm underline">Generate roast</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Upcoming fixtures</h2>
            <Badge label="Data source: seeded" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {nextFixtures.map((f, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/60">
                <p className="text-sm text-slate-300">{format(f.kickoffTs, "EEE dd MMM, HH:mm")}</p>
                <p className="font-semibold">{f.homeClub} vs {f.awayClub}</p>
                <p className="text-xs text-slate-400">{f.competition}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold mb-2">Next watch party</h2>
          <p className="text-xl font-bold">{nextEvent.title}</p>
          <p className="text-slate-300">{nextEvent.date} · {nextEvent.location}</p>
          <Link href="/events" className="underline text-sm mt-2 inline-block">View events</Link>
        </Card>
      </section>
      <section className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-semibold mb-2">This day in rivalry history</h2>
          <p>{thisDay.claim}</p>
          <p className="text-xs text-slate-400">Source: <a href={thisDay.sourceUrl} className="underline">{thisDay.sourceName}</a> · Last checked {format(thisDay.lastCheckedAt, "dd MMM yyyy")}</p>
        </Card>
        <Card>
          <h2 className="font-semibold mb-2">Quick actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/banter" className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">Roast Generator</Link>
            <Link href="/predictions" className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">Predictions</Link>
            <Link href="/trivia" className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">Trivia</Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
