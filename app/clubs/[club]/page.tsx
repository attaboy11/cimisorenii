import { notFound } from "next/navigation";
import { clubs, fixtures, facts } from "@/lib/seededData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ClubPage({ params }: { params: { club: string } }) {
  const club = clubs.find((c) => c.code === params.club);
  if (!club) return notFound();
  const clubFacts = facts.filter((f) => f.club === club.name).slice(0, 3);
  const clubFixtures = fixtures
    .filter((f) => f.homeClub === club.name || f.awayClub === club.name)
    .sort((a, b) => a.kickoffTs.getTime() - b.kickoffTs.getTime())
    .slice(0, 5);
  const rivals = clubs.filter((c) => c.code !== club.code);
  return (
    <main className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center uppercase font-black">{club.code[0]}</div>
        <div>
          <h1 className="text-2xl font-bold">{club.name}</h1>
          <p className="text-slate-400 text-sm">Rivalries with {rivals.map((r) => r.name).join(", ")}</p>
        </div>
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Fixtures & results</h2>
          <Badge label="Seeded" />
        </div>
        <div className="space-y-2 mt-2">
          {clubFixtures.map((f) => (
            <div key={f.id} className="flex justify-between text-sm bg-slate-800/60 rounded-lg px-3 py-2">
              <span>{format(f.kickoffTs, "dd MMM HH:mm")}</span>
              <span className="font-semibold">{f.homeClub} vs {f.awayClub}</span>
              <span className="text-slate-400">{f.status === "FT" ? `${f.homeScore}-${f.awayScore}` : f.status}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold mb-2">Facts with citations</h2>
        <div className="space-y-2">
          {clubFacts.map((fact) => (
            <div key={fact.id} className="bg-slate-800/60 rounded-lg px-3 py-2">
              <p>{fact.claim}</p>
              <p className="text-xs text-slate-400">{fact.category} · Source <a href={fact.sourceUrl} className="underline">{fact.sourceName}</a> · Checked {format(fact.lastCheckedAt, "dd MMM yyyy")}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold mb-2">Rivalry snippets</h2>
        <div className="flex flex-wrap gap-2">
          {rivals.map((r) => (
            <span key={r.code} className="px-3 py-2 rounded-lg bg-slate-800/60">{club.name} vs {r.name}: spicy since forever</span>
          ))}
        </div>
      </Card>
    </main>
  );
}
