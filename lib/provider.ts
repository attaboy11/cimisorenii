import { fixtures, clubs } from "./seededData";

export type ProviderMode = "seeded" | "live";

export interface FixtureProvider {
  mode: ProviderMode;
  getUpcomingFixtures(clubNames: string[], from: Date, to: Date): Promise<typeof fixtures>;
  getRecentResults(clubNames: string[], from: Date, to: Date): Promise<typeof fixtures>;
  getFixtureById(id: string): Promise<(typeof fixtures)[number] | undefined>;
}

class SeededProvider implements FixtureProvider {
  mode: ProviderMode = "seeded";
  async getUpcomingFixtures(clubNames: string[], from: Date, to: Date) {
    return fixtures.filter(
      (f) =>
        f.kickoffTs >= from &&
        f.kickoffTs <= to &&
        clubNames.some((c) => f.homeClub === c || f.awayClub === c) &&
        f.status !== "FT"
    );
  }
  async getRecentResults(clubNames: string[], from: Date, to: Date) {
    return fixtures.filter(
      (f) =>
        f.kickoffTs >= from &&
        f.kickoffTs <= to &&
        clubNames.some((c) => f.homeClub === c || f.awayClub === c) &&
        f.status === "FT"
    );
  }
  async getFixtureById(id: string) {
    return fixtures.find((f) => f.id === id);
  }
}

export const provider: FixtureProvider = new SeededProvider();
export const clubNames = clubs.map((c) => c.name);
