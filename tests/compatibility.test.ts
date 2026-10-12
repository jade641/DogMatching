import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ageScore,
  breedLevel,
  canonicalBreed,
  computeCompatibility,
  matchesPreferences,
  rankCandidates,
  temperamentLevel,
  WEIGHTS,
} from "../supabase/functions/_shared/compatibility.ts";

const dog = (
  id: string,
  breed: string,
  age: number,
  sex: "male" | "female",
  temperament: string[],
  extra: Record<string, unknown> = {},
) => ({ id, name: id, breed, age, sex, temperament, ...extra });

describe("weights (Table 7)", () => {
  it("sum to 100%", () => {
    assert.equal(WEIGHTS.breed + WEIGHTS.age + WEIGHTS.sex + WEIGHTS.temperament, 1);
  });
});

describe("paper worked example (Tables 12–13, §2.3.3)", () => {
  it("Labrador 2y male Friendly vs Labrador 1y female Friendly scores 100", () => {
    const target = dog("target", "Labrador", 2, "male", ["Friendly"]);
    const candidate = dog("candidate", "Labrador", 1, "female", ["Friendly"]);
    const c = computeCompatibility(target, candidate);
    assert.equal(c.breed.score, 100);
    assert.equal(c.age.score, 100);
    assert.equal(c.sex.score, 100);
    assert.equal(c.temperament.score, 100);
    assert.equal(c.total, 100);
  });
});

describe("breed compatibility (Table 8)", () => {
  it("same breed, including aliases and spelling variants", () => {
    assert.equal(breedLevel("Labrador Retriever", "lab"), "same");
    assert.equal(breedLevel("Shitzu", "Shih Tzu"), "same");
    assert.equal(breedLevel("Some Rare Breed", "some rare breed"), "same");
  });
  it("similar breed when both are in the same group", () => {
    assert.equal(breedLevel("Labrador Retriever", "Golden Retriever"), "similar");
    assert.equal(breedLevel("Siberian Husky", "Alaskan Malamute"), "similar");
  });
  it("different breed otherwise, including unknown breeds", () => {
    assert.equal(breedLevel("Shih Tzu", "Rottweiler"), "different");
    assert.equal(breedLevel("Unknown A", "Unknown B"), "different");
  });
  it("canonicalises common local names", () => {
    assert.equal(canonicalBreed("aspin"), "Aspin (Asong Pinoy)");
    assert.equal(canonicalBreed("  husky "), "Siberian Husky");
  });
});

describe("age compatibility (Table 9)", () => {
  it("follows the age-difference bands", () => {
    assert.equal(ageScore(0), 100);
    assert.equal(ageScore(1), 100);
    assert.equal(ageScore(1.5), 80);
    assert.equal(ageScore(2), 80);
    assert.equal(ageScore(3), 60);
    assert.equal(ageScore(3.5), 30);
    assert.equal(ageScore(-4), 30);
  });
});

describe("sex compatibility (Table 10)", () => {
  it("opposite sex scores 100, same sex 0", () => {
    const a = dog("a", "Beagle", 3, "male", ["Calm"]);
    assert.equal(computeCompatibility(a, dog("b", "Beagle", 3, "female", ["Calm"])).sex.score, 100);
    assert.equal(computeCompatibility(a, dog("c", "Beagle", 3, "male", ["Calm"])).sex.score, 0);
  });
});

describe("temperament compatibility (Table 11)", () => {
  it("highly compatible when a trait is shared", () => {
    assert.equal(temperamentLevel(["Friendly", "Calm"], ["friendly"]), "high");
  });
  it("highly compatible when traits share a disposition group", () => {
    assert.equal(temperamentLevel(["Protective"], ["Loyal"]), "high");
  });
  it("poor when energy levels conflict", () => {
    assert.equal(temperamentLevel(["Calm"], ["Energetic"]), "poor");
  });
  it("moderate otherwise or when data is missing", () => {
    assert.equal(temperamentLevel(["Protective"], ["Playful"]), "moderate");
    assert.equal(temperamentLevel([], ["Playful"]), "moderate");
  });
});

describe("weighted sum", () => {
  it("combines criterion scores with the proposed weights", () => {
    // similar breed 70, age gap 3 -> 60, opposite sex 100, poor temperament 40
    const c = computeCompatibility(
      dog("a", "Labrador Retriever", 2, "male", ["Calm"]),
      dog("b", "Golden Retriever", 5, "female", ["Energetic"]),
    );
    assert.equal(c.exact, 0.35 * 70 + 0.25 * 60 + 0.15 * 100 + 0.25 * 40);
    assert.equal(c.total, 65);
  });
});

describe("ranking (Figure 3)", () => {
  const target = dog("me", "Labrador Retriever", 2, "male", ["Friendly"]);
  const pool = [
    dog("A", "Labrador Retriever", 2, "female", ["Friendly"], { tier: 1 }),
    dog("B", "Golden Retriever", 3, "female", ["Friendly"], { tier: 2 }),
    dog("C", "Shih Tzu", 6, "female", ["Energetic"]),
    dog("D", "Labrador Retriever", 2, "male", ["Friendly"]),
    dog("E", "Rottweiler", 2, "female", ["Loyal"], { tier: 3 }),
    dog("me", "Labrador Retriever", 2, "female", ["Friendly"]),
  ];

  it("returns the top three opposite-sex candidates in descending order", () => {
    const ranked = rankCandidates(target, pool);
    assert.deepEqual(ranked.map((r) => r.candidate.id), ["A", "B", "E"]);
    const scores = ranked.map((r) => r.compatibility.exact);
    assert.deepEqual([...scores].sort((a, b) => b - a), scores);
  });

  it("never recommends same-sex dogs or the target itself", () => {
    const ids = rankCandidates(target, pool, { limit: 10 }).map((r) => r.candidate.id);
    assert.ok(!ids.includes("D"));
    assert.ok(!ids.includes("me"));
  });

  it("breaks ties by verification tier", () => {
    const tied = [
      dog("low", "Labrador Retriever", 2, "female", ["Friendly"], { tier: 0 }),
      dog("high", "Labrador Retriever", 2, "female", ["Friendly"], { tier: 3 }),
    ];
    assert.equal(rankCandidates(target, tied)[0].candidate.id, "high");
  });

  it("applies matcher preferences before ranking", () => {
    const ranked = rankCandidates(target, pool, { preferences: { breed: "retriever", verifiedOnly: false } });
    assert.deepEqual(ranked.map((r) => r.candidate.id), ["A", "B"]);
  });
});

describe("matcher preferences", () => {
  const candidate = {
    ...dog("x", "Golden Retriever", 3, "female", ["Friendly", "Calm"]),
    color: "Golden",
    size: "large",
    verified: true,
  };
  it("matches breed, color, size, temperament and verification", () => {
    assert.ok(matchesPreferences(candidate, { breed: "golden", color: "Golden", size: "large", temperament: "Calm", verifiedOnly: true }));
    assert.ok(!matchesPreferences(candidate, { size: "small" }));
    assert.ok(!matchesPreferences(candidate, { temperament: "Protective" }));
    assert.ok(!matchesPreferences(candidate, { color: "Black" }));
    assert.ok(!matchesPreferences({ ...candidate, verified: false }, { verifiedOnly: true }));
  });
});
