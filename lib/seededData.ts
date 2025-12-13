import { addDays, subDays } from "date-fns";
import seedrandom from "seedrandom";

export const clubs = [
  { name: "Aston Villa", code: "villa", accent: "villa" },
  { name: "Arsenal", code: "arsenal", accent: "arsenal" },
  { name: "Manchester United", code: "united", accent: "united" },
  { name: "Chelsea", code: "chelsea", accent: "chelsea" },
];

export type Fixture = {
  id: string;
  homeClub: string;
  awayClub: string;
  kickoffTs: Date;
  competition: string;
  status: string;
  provider: "seeded" | "live";
  homeScore?: number;
  awayScore?: number;
};

export const fixtures: Fixture[] = Array.from({ length: 40 }).map((_, idx) => {
  const home = clubs[(idx + 1) % clubs.length].name;
  const away = clubs[(idx + 2) % clubs.length].name;
  const kickoffTs = addDays(new Date(), idx - 20);
  return {
    id: `seed-${idx}`,
    homeClub: home,
    awayClub: away,
    kickoffTs,
    competition: ["Premier League", "FA Cup", "Europa"][idx % 3],
    status: kickoffTs < new Date() ? "FT" : "NS",
    provider: "seeded",
    homeScore: kickoffTs < new Date() ? (idx % 3) + 1 : undefined,
    awayScore: kickoffTs < new Date() ? idx % 2 : undefined,
  };
});

export const facts = clubs.flatMap((club) =>
  Array.from({ length: 25 }).map((_, idx) => ({
    id: `${club.code}-${idx}`,
    club: club.name,
    category: ["trophies", "managers", "iconic match", "current season", "fun stat"][idx % 5],
    claim: `${club.name} fact ${idx + 1} with proper citation`,
    sourceName: `${club.name} source`,
    sourceUrl: `https://example.com/${club.code}-${idx + 1}`,
    lastCheckedAt: subDays(new Date(), idx % 7),
  }))
);

export const trivia = {
  questions: [
    ...clubs.flatMap((club) =>
      Array.from({ length: 20 }).map((_, idx) => ({
        id: `${club.code}-${idx}`,
        club: club.name,
        difficulty: idx % 2 === 0 ? "easy" : "medium",
        question: `${club.name} trivia ${idx + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answerIndex: idx % 4,
        explanation: `${club.name} explanation ${idx + 1}`,
        sourceName: `${club.name} almanac`,
        sourceUrl: `https://example.com/${club.code}-trivia-${idx + 1}`,
      }))
    ),
    ...Array.from({ length: 40 }).map((_, idx) => ({
      id: `gen-${idx}`,
      club: "General",
      difficulty: idx % 3 === 0 ? "hard" : "easy",
      question: `General football trivia ${idx + 1}?`,
      options: ["A", "B", "C", "D"],
      answerIndex: idx % 4,
      explanation: `General explanation ${idx + 1}`,
      sourceName: "General source",
      sourceUrl: `https://example.com/general-${idx + 1}`,
    })),
  ],
};

export const banterPacks = ["Aston Villa vs Arsenal", "Arsenal vs Chelsea", "United vs Chelsea"].map((name, idx) => ({
  id: idx + 1,
  name,
  entries: [
    `${name} jab 1`,
    `${name} jab 2`,
    `${name} jab 3`,
  ],
}));

export const blockedTerms = ["slur1", "slur2", "slur3"];

export function seededRNG(seed: string) {
  return seedrandom(seed);
}
