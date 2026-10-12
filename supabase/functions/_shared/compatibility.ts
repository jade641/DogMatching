/**
 * PawMatch Compatibility Scoring Algorithm (paper §2.3.2).
 *
 * Weighted Sum Model:
 *   Compatibility Score = 0.35·BreedMatch + 0.25·AgeMatch + 0.15·SexMatch + 0.25·TemperamentMatch
 *
 * Criterion scores follow Tables 8–11 of the paper. This file is plain
 * TypeScript with no imports so the same code runs in the React Native app,
 * in Node unit tests, and in the Supabase Edge Function (Deno).
 */

export type Sex = "male" | "female";
export type Size = "small" | "medium" | "large";

export const WEIGHTS = {
  breed: 0.35,
  age: 0.25,
  sex: 0.15,
  temperament: 0.25,
} as const;

/** Table 8. Breed Compatibility */
export const BREED_SCORES = { same: 100, similar: 70, different: 20 } as const;
/** Table 10. Sex Compatibility */
export const SEX_SCORES = { opposite: 100, same: 0 } as const;
/** Table 11. Temperament */
export const TEMPERAMENT_SCORES = { high: 100, moderate: 70, poor: 40 } as const;

/** Table 9. Age Compatibility (difference in years). */
export function ageScore(difference: number): number {
  const d = Math.abs(difference);
  if (d <= 1) return 100;
  if (d <= 2) return 80;
  if (d <= 3) return 60;
  return 30;
}

/**
 * "Similar breed" means both breeds belong to the same recognized breed group
 * (AKC-style grouping), so they share size, coat and working background.
 */
export const BREED_GROUPS: Record<string, string[]> = {
  Toy: [
    "Shih Tzu", "Chihuahua", "Pomeranian", "Toy Poodle", "Maltese", "Yorkshire Terrier",
    "Pug", "Pekingese", "Papillon", "Cavalier King Charles Spaniel", "Japanese Chin", "Havanese",
  ],
  "Non-Sporting": [
    "Poodle", "Miniature Poodle", "French Bulldog", "Bulldog", "Boston Terrier", "Chow Chow",
    "Dalmatian", "Lhasa Apso", "Bichon Frise", "Shiba Inu", "Japanese Spitz", "Shar Pei",
  ],
  Sporting: [
    "Labrador Retriever", "Golden Retriever", "Cocker Spaniel", "English Springer Spaniel",
    "German Shorthaired Pointer", "Weimaraner", "Vizsla",
  ],
  Herding: [
    "German Shepherd", "Belgian Malinois", "Border Collie", "Australian Shepherd",
    "Pembroke Welsh Corgi", "Shetland Sheepdog", "Rough Collie", "Old English Sheepdog",
  ],
  Working: [
    "Siberian Husky", "Alaskan Malamute", "Samoyed", "Rottweiler", "Doberman Pinscher", "Boxer",
    "Great Dane", "Saint Bernard", "Akita", "Cane Corso", "Bernese Mountain Dog", "Mastiff",
  ],
  Hound: [
    "Beagle", "Dachshund", "Basset Hound", "Greyhound", "Whippet", "Basenji", "Rhodesian Ridgeback",
  ],
  Terrier: [
    "Jack Russell Terrier", "Bull Terrier", "American Staffordshire Terrier",
    "American Pit Bull Terrier", "American Bully", "Miniature Schnauzer",
    "West Highland White Terrier", "Scottish Terrier", "Airedale Terrier",
  ],
  "Native & Mixed": ["Aspin (Asong Pinoy)", "Mixed Breed"],
};

/** Every known breed, alphabetically — used for the breed picker. */
export const BREEDS: string[] = Object.values(BREED_GROUPS).flat().sort((a, b) => a.localeCompare(b));

const BREED_ALIASES: Record<string, string> = {
  lab: "Labrador Retriever",
  labrador: "Labrador Retriever",
  golden: "Golden Retriever",
  husky: "Siberian Husky",
  gsd: "German Shepherd",
  germanshepherddog: "German Shepherd",
  aspin: "Aspin (Asong Pinoy)",
  asongpinoy: "Aspin (Asong Pinoy)",
  askal: "Aspin (Asong Pinoy)",
  mixed: "Mixed Breed",
  mix: "Mixed Breed",
  pom: "Pomeranian",
  frenchie: "French Bulldog",
  englishbulldog: "Bulldog",
  shitzu: "Shih Tzu",
  shihtzu: "Shih Tzu",
  doberman: "Doberman Pinscher",
  corgi: "Pembroke Welsh Corgi",
  pitbull: "American Pit Bull Terrier",
  bully: "American Bully",
  malinois: "Belgian Malinois",
  schnauzer: "Miniature Schnauzer",
  yorkie: "Yorkshire Terrier",
  chow: "Chow Chow",
  standardpoodle: "Poodle",
  sheltie: "Shetland Sheepdog",
  collie: "Rough Collie",
  westie: "West Highland White Terrier",
  cavalier: "Cavalier King Charles Spaniel",
  spitz: "Japanese Spitz",
  shiba: "Shiba Inu",
  dachshound: "Dachshund",
  rottie: "Rottweiler",
};

function breedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

const BREED_INDEX: Record<string, string> = (() => {
  const index: Record<string, string> = {};
  for (const breed of BREEDS) index[breedKey(breed)] = breed;
  for (const [alias, breed] of Object.entries(BREED_ALIASES)) index[alias] = breed;
  return index;
})();

const GROUP_OF: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [group, breeds] of Object.entries(BREED_GROUPS)) {
    for (const breed of breeds) map[breed] = group;
  }
  return map;
})();

/** Maps free-text input ("lab", "Shitzu") to a canonical breed name when known. */
export function canonicalBreed(value: string): string {
  const trimmed = value.trim();
  return BREED_INDEX[breedKey(trimmed)] ?? trimmed;
}

export function breedGroup(value: string): string | null {
  return GROUP_OF[canonicalBreed(value)] ?? null;
}

export type BreedLevel = "same" | "similar" | "different";

export function breedLevel(a: string, b: string): BreedLevel {
  const ca = canonicalBreed(a);
  const cb = canonicalBreed(b);
  if (breedKey(ca) === breedKey(cb)) return "same";
  const ga = GROUP_OF[ca];
  const gb = GROUP_OF[cb];
  if (ga && gb && ga === gb) return "similar";
  return "different";
}

/** Temperament traits offered in the app. */
export const TEMPERAMENT_OPTIONS = [
  "Friendly", "Calm", "Playful", "Active", "Energetic", "Gentle",
  "Affectionate", "Loyal", "Protective", "Alert", "Intelligent", "Independent",
] as const;

/** Traits in the same group express the same behavioural disposition. */
const TEMPERAMENT_GROUPS: Record<string, string[]> = {
  sociable: ["friendly", "affectionate", "gentle", "playful"],
  energetic: ["active", "energetic", "playful"],
  calm: ["calm", "gentle", "independent"],
  guardian: ["protective", "loyal", "alert", "intelligent"],
};

/** Energy-level mismatches that make pairings behaviourally poor. */
const CONFLICTING_TRAITS: [string, string][] = [
  ["calm", "energetic"],
  ["calm", "active"],
  ["gentle", "energetic"],
  ["independent", "affectionate"],
];

export type TemperamentLevel = "high" | "moderate" | "poor";

function normTrait(t: string): string {
  return t.trim().toLowerCase();
}

/**
 * Temperament compatibility (Table 11):
 * - Highly compatible: the dogs share a trait, or (without any conflicting pair)
 *   have traits from the same disposition group.
 * - Poor compatibility: no shared trait and at least one conflicting pair.
 * - Moderately compatible: everything else, including missing data.
 */
export function temperamentLevel(a: string[], b: string[]): TemperamentLevel {
  const ta = [...new Set(a.map(normTrait).filter(Boolean))];
  const tb = [...new Set(b.map(normTrait).filter(Boolean))];
  if (ta.length === 0 || tb.length === 0) return "moderate";
  if (ta.some((t) => tb.includes(t))) return "high";

  const conflict = ta.some((x) =>
    tb.some((y) => CONFLICTING_TRAITS.some(([p, q]) => (p === x && q === y) || (p === y && q === x))),
  );
  if (conflict) return "poor";

  const sameGroup = Object.values(TEMPERAMENT_GROUPS).some(
    (group) => ta.some((t) => group.includes(t)) && tb.some((t) => group.includes(t)),
  );
  return sameGroup ? "high" : "moderate";
}

export interface CompatibilityProfile {
  breed: string;
  age: number;
  sex: Sex;
  temperament: string[];
}

export interface CompatibilityBreakdown {
  breed: { level: BreedLevel; score: number };
  age: { difference: number; score: number };
  sex: { opposite: boolean; score: number };
  temperament: { level: TemperamentLevel; score: number; shared: string[] };
  /** Unrounded weighted sum (0–100). */
  exact: number;
  /** Weighted sum rounded to a whole percentage. */
  total: number;
}

export function computeCompatibility(
  target: CompatibilityProfile,
  candidate: CompatibilityProfile,
): CompatibilityBreakdown {
  const bLevel = breedLevel(target.breed, candidate.breed);
  const breed = BREED_SCORES[bLevel];

  const difference = Math.round(Math.abs(Number(target.age) - Number(candidate.age)) * 10) / 10;
  const age = ageScore(difference);

  const opposite = target.sex !== candidate.sex;
  const sex = opposite ? SEX_SCORES.opposite : SEX_SCORES.same;

  const tLevel = temperamentLevel(target.temperament, candidate.temperament);
  const temperament = TEMPERAMENT_SCORES[tLevel];
  const candidateTraits = candidate.temperament.map(normTrait);
  const shared = target.temperament.filter((t) => candidateTraits.includes(normTrait(t)));

  const exact =
    WEIGHTS.breed * breed + WEIGHTS.age * age + WEIGHTS.sex * sex + WEIGHTS.temperament * temperament;

  return {
    breed: { level: bLevel, score: breed },
    age: { difference, score: age },
    sex: { opposite, score: sex },
    temperament: { level: tLevel, score: temperament, shared },
    exact,
    total: Math.round(exact),
  };
}

/** Short human-readable reasons shown on match cards. */
export function explainCompatibility(c: CompatibilityBreakdown, candidateBreed: string): string[] {
  const reasons: string[] = [];
  if (c.breed.level === "same") reasons.push("Same breed");
  else if (c.breed.level === "similar") reasons.push(`Similar breed (${breedGroup(candidateBreed)} group)`);
  if (c.age.score >= 80) reasons.push(c.age.difference <= 1 ? "Age gap ≤ 1 yr" : "Age gap 2 yrs");
  if (c.temperament.shared.length > 0) reasons.push(`Both ${c.temperament.shared[0].toLowerCase()}`);
  else if (c.temperament.level === "high") reasons.push("Compatible temperament");
  if (reasons.length === 0) reasons.push(c.sex.opposite ? "Opposite sex" : "Same sex");
  return reasons.slice(0, 3);
}

export interface MatchPreferences {
  breed?: string;
  color?: string;
  size?: Size | "any";
  temperament?: string;
  verifiedOnly?: boolean;
}

export interface CandidateFields extends CompatibilityProfile {
  id: string;
  name: string;
  color?: string | null;
  size?: string | null;
  tier?: number | null;
  verified?: boolean | null;
}

/** Preference filters from the Breeding Matcher screen (Figure 11). */
export function matchesPreferences(candidate: CandidateFields, prefs: MatchPreferences): boolean {
  if (prefs.breed && prefs.breed.trim()) {
    const wanted = canonicalBreed(prefs.breed);
    const have = canonicalBreed(candidate.breed);
    if (breedKey(wanted) !== breedKey(have) && !breedKey(have).includes(breedKey(prefs.breed))) return false;
  }
  if (prefs.color && prefs.color.trim()) {
    const words = prefs.color.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
    const color = (candidate.color ?? "").toLowerCase();
    if (words.length > 0 && !words.some((w) => color.includes(w))) return false;
  }
  if (prefs.size && prefs.size !== "any" && candidate.size !== prefs.size) return false;
  if (prefs.temperament && prefs.temperament.trim()) {
    const wanted = normTrait(prefs.temperament);
    if (!candidate.temperament.some((t) => normTrait(t) === wanted)) return false;
  }
  if (prefs.verifiedOnly && !candidate.verified) return false;
  return true;
}

export interface RankedCandidate<T> {
  candidate: T;
  compatibility: CompatibilityBreakdown;
  reasons: string[];
}

/**
 * Scores every candidate against the target dog, ranks them from highest to
 * lowest and returns the top N (paper Figure 3). Same-sex candidates are
 * excluded because sex compatibility is a biological requirement for breeding.
 * Ties are broken by verification tier, then by name.
 */
export function rankCandidates<T extends CandidateFields>(
  target: CompatibilityProfile & { id?: string },
  candidates: T[],
  options: { limit?: number; preferences?: MatchPreferences } = {},
): RankedCandidate<T>[] {
  const limit = options.limit ?? 3;
  return candidates
    .filter((c) => c.id !== target.id && c.sex !== target.sex)
    .filter((c) => !options.preferences || matchesPreferences(c, options.preferences))
    .map((candidate) => {
      const compatibility = computeCompatibility(target, candidate);
      return { candidate, compatibility, reasons: explainCompatibility(compatibility, candidate.breed) };
    })
    .sort(
      (a, b) =>
        b.compatibility.exact - a.compatibility.exact ||
        (b.candidate.tier ?? 0) - (a.candidate.tier ?? 0) ||
        a.candidate.name.localeCompare(b.candidate.name),
    )
    .slice(0, limit);
}
