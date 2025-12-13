import { Card } from "@/components/ui/card";
import { blockedTerms, banterPacks, facts } from "@/lib/seededData";

export default function AdminPage() {
  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold mb-2">Admin console</h1>
        <p className="text-sm text-slate-400">Invite codes, banter packs, provider mode.</p>
      </Card>
      <Card>
        <h2 className="font-semibold">Blocked terms</h2>
        <div className="flex gap-2 flex-wrap mt-2">
          {blockedTerms.map((term) => (
            <span key={term} className="px-3 py-1 rounded-lg bg-slate-800/60">{term}</span>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold">Banter packs</h2>
        <ul className="list-disc ml-5 text-sm text-slate-300">
          {banterPacks.map((pack) => (
            <li key={pack.id}>{pack.name} ({pack.entries.length} entries)</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">Facts entries</h2>
        <p className="text-sm text-slate-400">Total: {facts.length} facts seeded.</p>
      </Card>
    </main>
  );
}
