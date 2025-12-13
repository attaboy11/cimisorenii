import { PrismaClient } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

const clubs = ["Aston Villa", "Arsenal", "Manchester United", "Chelsea"];
const clubShort = {
  "Aston Villa": "villa",
  Arsenal: "arsenal",
  "Manchester United": "united",
  Chelsea: "chelsea",
} as const;

const users = [
  { name: "Maya", club: "Arsenal", role: "owner" },
  { name: "Tommy", club: "Aston Villa", role: "member" },
  { name: "Priya", club: "Chelsea", role: "member" },
  { name: "Jordan", club: "Manchester United", role: "member" },
  { name: "Sophie", club: "Aston Villa", role: "member" },
  { name: "Liam", club: "Arsenal", role: "member" },
  { name: "Aisha", club: "Chelsea", role: "member" },
  { name: "Ben", club: "Manchester United", role: "member" },
];

const factsPerClub = 25;
function makeFacts() {
  const categories = ["trophies", "managers", "iconic match", "current season", "fun stat"];
  const facts: { club: string; category: string; claim: string; sourceName: string; sourceUrl: string; lastCheckedAt: Date }[] = [];
  clubs.forEach((club) => {
    for (let i = 0; i < factsPerClub; i++) {
      const category = categories[i % categories.length];
      facts.push({
        club,
        category,
        claim: `${club} fact ${i + 1}: notable ${category} highlight with UK flavour`,
        sourceName: `${club} source`,
        sourceUrl: `https://example.com/${clubShort[club as keyof typeof clubShort]}-${i + 1}`,
        lastCheckedAt: subDays(new Date(), i % 10),
      });
    }
  });
  return facts;
}

function makeFixtures() {
  const fixtures = [] as any[];
  const competitions = ["Premier League", "FA Cup", "Europa"];
  let idx = 0;
  for (let i = -45; i <= 60; i += 3) {
    const home = clubs[(idx + 1) % clubs.length];
    const away = clubs[(idx + 2) % clubs.length];
    fixtures.push({
      provider: "seeded",
      matchId: `M-${idx}`,
      homeClub: home,
      awayClub: away,
      kickoffTs: addDays(new Date(), i),
      competition: competitions[idx % competitions.length],
      status: i < 0 ? "FT" : "NS",
      homeScore: i < 0 ? (idx % 3) + 1 : null,
      awayScore: i < 0 ? (idx % 2) : null,
      updatedAt: new Date(),
    });
    idx++;
  }
  return fixtures.slice(0, 40);
}

const reactionTypes = ["😂", "🤡", "🧂", "🧠"];

function generateTrivia() {
  const perClub = 20;
  const general = 40;
  const entries: any[] = [];
  clubs.forEach((club) => {
    for (let i = 0; i < perClub; i++) {
      entries.push({
        club,
        difficulty: i % 2 === 0 ? "easy" : "medium",
        question: `${club} trivia Q${i + 1}?`,
        optionsJson: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
        answerIndex: i % 4,
        explanation: `${club} explanation ${i + 1}`,
        sourceName: `${club} almanac`,
        sourceUrl: `https://example.com/${clubShort[club as keyof typeof clubShort]}-trivia-${i + 1}`,
      });
    }
  });
  for (let i = 0; i < general; i++) {
    entries.push({
      club: "General",
      difficulty: i % 3 === 0 ? "hard" : "easy",
      question: `General football trivia ${i + 1}?`,
      optionsJson: JSON.stringify(["A", "B", "C", "D"]),
      answerIndex: i % 4,
      explanation: `General explanation ${i + 1}`,
      sourceName: "General source",
      sourceUrl: `https://example.com/general-${i + 1}`,
    });
  }
  return entries;
}

function banterTemplates() {
  const combos = [
    ["Aston Villa", "Arsenal"],
    ["Aston Villa", "Manchester United"],
    ["Aston Villa", "Chelsea"],
    ["Arsenal", "Manchester United"],
    ["Arsenal", "Chelsea"],
    ["Manchester United", "Chelsea"],
  ];
  const entries: any[] = [];
  combos.forEach(([club, rival]) => {
    for (let i = 0; i < 30; i++) {
      entries.push({
        name: `${club} vs ${rival} banter pack ${i + 1}`,
        createdByUserId: 1,
        entriesJson: JSON.stringify([`${club} jab ${i + 1} at ${rival}`, `Reply ${i + 1}`]),
      });
    }
  });
  return entries;
}

async function main() {
  await prisma.$transaction([
    prisma.reaction.deleteMany(),
    prisma.post.deleteMany(),
    prisma.prediction.deleteMany(),
    prisma.fixture.deleteMany(),
    prisma.fact.deleteMany(),
    prisma.triviaQuestion.deleteMany(),
    prisma.user.deleteMany(),
    prisma.inviteCode.deleteMany(),
    prisma.event.deleteMany(),
    prisma.banterPack.deleteMany(),
    prisma.rSVP.deleteMany(),
    prisma.blockedTerm.deleteMany(),
  ]);

  const createdUsers = await Promise.all(
    users.map((u) => prisma.user.create({ data: u }))
  );

  await prisma.inviteCode.createMany({
    data: [
      { code: "FOOTYCREW", isUsed: false },
      { code: "VILLA4LIFE", isUsed: false },
      { code: "GUNNERS", isUsed: false },
    ],
  });

  await prisma.blockedTerm.createMany({
    data: [
      { term: "slur1" },
      { term: "slur2" },
      { term: "slur3" },
    ],
  });

  await prisma.fact.createMany({ data: makeFacts() });
  const fixtures = await prisma.$transaction(
    makeFixtures().map((f) => prisma.fixture.create({ data: f }))
  );

  await prisma.triviaQuestion.createMany({ data: generateTrivia() });

  await prisma.banterPack.createMany({ data: banterTemplates() });

  const posts = await Promise.all(
    [
      "Villa are cooking and the North Bank is sweating",
      "Arsenal are allergic to silver polish",
      "United still living off Fergie fumes",
      "Chelsea spent a billion for vibes",
      "Villa Park is the new fortress",
      "Odegaard masterclass incoming",
      "Old Trafford library hours",
      "Stamford Bridge tour includes the injury room",
      "Unai Emery tactical lecture",
      "Pochettino roulette continues",
    ].map((content, idx) =>
      prisma.post.create({
        data: {
          authorId: createdUsers[idx % createdUsers.length].id,
          clubTarget: clubs[idx % clubs.length],
          clubRival: clubs[(idx + 1) % clubs.length],
          intensity: ["mild", "medium", "savage"][idx % 3],
          style: ["dry", "absurd", "statistical", "poetic"][idx % 4],
          content,
        },
      })
    )
  );

  await prisma.reaction.createMany({
    data: posts.flatMap((post, idx) =>
      reactionTypes.map((type) => ({
        postId: post.id,
        userId: createdUsers[(idx + reactionTypes.indexOf(type)) % createdUsers.length].id,
        type,
      }))
    ),
  });

  const predictionsData = fixtures.slice(0, 8).map((fixture, idx) => ({
    fixtureId: fixture.id,
    userId: createdUsers[idx % createdUsers.length].id,
    homeScore: (idx % 3) + 1,
    awayScore: idx % 2,
    boldClaim: "Late winner incoming",
    pointsAwarded: idx % 4,
  }));
  await prisma.prediction.createMany({ data: predictionsData });

  await prisma.triviaRun.createMany({
    data: createdUsers.map((u, idx) => ({
      userId: u.id,
      score: 5 + (idx % 5),
      total: 10,
      durationSec: 70 + idx,
    })),
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Derby watch at The Crown",
        location: "The Crown, Shoreditch",
        kickoffTs: addDays(new Date(), 3),
        fixtureId: fixtures[fixtures.length - 2].id,
      },
      {
        title: "Champions League banter night",
        location: "Tommy's flat",
        kickoffTs: addDays(new Date(), 10),
        fixtureId: fixtures[fixtures.length - 5].id,
      },
      {
        title: "BBQ + Villa vs United",
        location: "Victoria Park",
        kickoffTs: addDays(new Date(), 14),
        fixtureId: fixtures[fixtures.length - 8].id,
      },
    ],
  });

  await prisma.rSVP.createMany({
    data: createdUsers.map((u, idx) => ({
      eventId: (idx % 3) + 1,
      userId: u.id,
      status: ["yes", "maybe", "no"][idx % 3],
    })),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
