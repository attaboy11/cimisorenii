import seedrandom from "seedrandom";
import { banterPacks, blockedTerms } from "./seededData";

const styles = {
  dry: "Bone-dry sarcasm",
  absurd: "Absurd hyperbole",
  statistical: "Facts and figures",
  poetic: "Poetic jabs",
};

export function generateRoasts({
  target,
  rival,
  intensity,
  style,
  date = new Date(),
}: {
  target: string;
  rival: string;
  intensity: "mild" | "medium" | "savage";
  style: keyof typeof styles;
  date?: Date;
}) {
  const seed = `${date.toDateString()}-${target}-${rival}-${intensity}-${style}`;
  const rng = seedrandom(seed);
  const templates = [
    `${target} fans living in ${styles[style]} land while ${rival} sharpen receipts`,
    `${rival} could lend ${target} a spine but intensity ${intensity} says nope`,
    `${target} trophy cabinet waiting list longer than VAR checks`,
    `${rival} nightmares start when ${target} take a corner... eventually`,
  ];
  const variants = Array.from({ length: 3 }).map((_, idx) => {
    const pick = Math.floor(rng() * templates.length);
    return `${templates[pick]} (${intensity})`;
  });
  const selfRoast = `${target} self-roast: sometimes the biggest rival is our own dodgy form.`;
  const pack = banterPacks.find((p) => p.name.toLowerCase().includes(target.toLowerCase()))?.entries ?? [];
  return { variants, selfRoast, pack };
}

export function toneGuard(text: string): { ok: boolean; term?: string } {
  const lowered = text.toLowerCase();
  const hit = blockedTerms.find((term) => lowered.includes(term.toLowerCase()));
  return hit ? { ok: false, term: hit } : { ok: true };
}
