/**
 * Shape matcher for sports *results* (winner / loser / tournament).
 * Team and player lists are aliases for parsing — they do not hard-code verdicts.
 */

const TEAM_NAMES = [
  "bangladesh",
  "australia",
  "england",
  "india",
  "pakistan",
  "sri lanka",
  "new zealand",
  "south africa",
  "west indies",
  "afghanistan",
  "ireland",
  "zimbabwe",
  "spain",
  "argentina",
  "brazil",
  "france",
  "germany",
  "portugal",
  "italy",
  "netherlands",
  "uruguay",
  "mexico",
  "croatia",
  "morocco",
  "japan",
  "south korea",
  "belgium",
  "colombia",
  "chile",
  "ecuador",
  "senegal",
  "ghana",
  "nigeria",
  "cameroon",
  "canada",
  "usa",
  "united states",
  "qatar",
  "saudi arabia",
];

/** Players → national side, used only to interpret “X lifts World Cup” style claims. */
const PLAYER_NATIONAL_SIDE: Array<{ match: RegExp; team: string }> = [
  { match: /\bmessi\b/i, team: "Argentina" },
  { match: /\bronaldo\b/i, team: "Portugal" },
  { match: /\bmbappe\b|\bmbappé\b/i, team: "France" },
];

const TEAM_ALT = TEAM_NAMES.slice().sort((a, b) => b.length - a.length).join("|");

const TROPHY =
  /\b(world cups?|fifa|euros?|copa(?:\s+america)?|champions league|premier league|ipl|asia cups?|olympics?|tournament|championship|trophy|title|final)\b/i;

function titleTeam(name: string): string {
  if (name.toLowerCase() === "usa") return "USA";
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function teamBoundary(name: string): RegExp {
  const pat = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`\\b${pat}\\b`, "i");
}

export function extractSportsTeams(text: string): string[] {
  const found: string[] = [];
  for (const t of TEAM_NAMES.slice().sort((a, b) => b.length - a.length)) {
    if (teamBoundary(t).test(text) && !found.some((f) => f.toLowerCase() === t)) {
      found.push(titleTeam(t));
    }
  }
  return found;
}

export function playerNationalTeam(text: string): string | undefined {
  return PLAYER_NATIONAL_SIDE.find((p) => p.match.test(text))?.team;
}

export interface SportsResultSides {
  winner?: string;
  loser?: string;
  tournament?: string;
}

function tournamentOf(text: string): string | undefined {
  const m = text.match(TROPHY);
  return m ? m[1].toLowerCase() : undefined;
}

export function parseSportsResult(text: string): SportsResultSides {
  const t = text.replace(/\s+/g, " ");
  const mapped = playerNationalTeam(t);
  const teams = extractSportsTeams(t);
  if (mapped && !teams.some((x) => x.toLowerCase() === mapped.toLowerCase())) {
    teams.push(mapped);
  }
  if (teams.length < 1) return {};
  const tournament = tournamentOf(t);

  const beat = t.match(
    new RegExp(
      `\\b(${TEAM_ALT})\\b[^.]{0,60}\\b(beat|defeated|thrashed)\\b[^.]{0,50}\\b(${TEAM_ALT})\\b`,
      "i"
    )
  );
  if (beat) {
    return {
      winner: titleTeam(beat[1].toLowerCase()),
      loser: titleTeam(beat[3].toLowerCase()),
      tournament,
    };
  }

  const wonAgainst = t.match(
    new RegExp(
      `\\b(${TEAM_ALT})\\b[^.]{0,50}\\bwon\\b[^.]{0,40}\\b(?:against|vs\\.?|versus)\\s+(${TEAM_ALT})\\b`,
      "i"
    )
  );
  if (wonAgainst) {
    return {
      winner: titleTeam(wonAgainst[1].toLowerCase()),
      loser: titleTeam(wonAgainst[2].toLowerCase()),
      tournament,
    };
  }

  const lostTo = t.match(
    new RegExp(`\\b(${TEAM_ALT})\\b[^.]{0,40}\\blost to\\b[^.]{0,30}\\b(${TEAM_ALT})\\b`, "i")
  );
  if (lostTo) {
    return {
      winner: titleTeam(lostTo[2].toLowerCase()),
      loser: titleTeam(lostTo[1].toLowerCase()),
      tournament,
    };
  }

  const lift = t.match(
    new RegExp(
      `\\b(${TEAM_ALT})\\b[^.]{0,40}\\b(lift(?:s|ed)?|won|wins|win|champion(?:s)?|title)\\b`,
      "i"
    )
  );
  if (lift && (tournament || TROPHY.test(t) || /\b(lift(?:s|ed)?)\b/i.test(t))) {
    return { winner: titleTeam(lift[1].toLowerCase()), tournament };
  }

  if (mapped && (/\b(lift(?:s|ed)?|won|wins|champion)\b/i.test(t) || tournament)) {
    return { winner: mapped, tournament };
  }

  return tournament ? { tournament } : {};
}

export function sportsSubjects(text: string): Set<string> {
  const out = new Set<string>();
  const sides = parseSportsResult(text);
  if (sides.winner) out.add(sides.winner.toLowerCase());
  if (sides.loser) out.add(sides.loser.toLowerCase());
  for (const t of extractSportsTeams(text)) out.add(t.toLowerCase());
  const mapped = playerNationalTeam(text);
  if (mapped) out.add(mapped.toLowerCase());
  return out;
}

export function sportsSubjectsOverlap(a: string, b: string): boolean {
  const A = sportsSubjects(a);
  const B = sportsSubjects(b);
  if (A.size === 0 || B.size === 0) return true;
  for (const x of A) if (B.has(x)) return true;
  return false;
}

function sameSide(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function sportsResultConflict(claim: string, evidence: string): "SUPPORTS" | "CONTRADICTS" | null {
  const claimSides = parseSportsResult(claim);
  if (!claimSides.winner) return null;
  const evSides = parseSportsResult(evidence);

  if (evSides.winner && sameSide(evSides.winner, claimSides.winner)) {
    return "SUPPORTS";
  }

  if (evSides.winner && !sameSide(evSides.winner, claimSides.winner)) {
    if (claimSides.loser && sameSide(evSides.winner, claimSides.loser)) return "CONTRADICTS";
    if (evSides.loser && sameSide(evSides.loser, claimSides.winner)) return "CONTRADICTS";
    const sameEvent = !!(
      (claimSides.tournament && evSides.tournament) ||
      TROPHY.test(claim) && TROPHY.test(evidence)
    );
    if (sameEvent) return "CONTRADICTS";
  }

  const teams = extractSportsTeams(claim);
  const elow = evidence.toLowerCase();
  const allTeamsPresent = teams.every((t) => teamBoundary(t).test(elow));
  const winCue = /\b(won|beat|defeated|victory|win|lift(?:s|ed)?|champion)\b/i.test(evidence);
  if (!allTeamsPresent || !winCue) return null;
  const winner = claimSides.winner.toLowerCase();
  const loser = (claimSides.loser || "").toLowerCase();
  if (loser && new RegExp(`${loser}.{0,50}(beat|defeated|thrashed|won).{0,40}${winner}`, "i").test(evidence)) {
    return "CONTRADICTS";
  }
  if (new RegExp(`${winner}.{0,80}(beat|defeated|thrashed|won|victory|win|lift)`, "i").test(evidence)) {
    return "SUPPORTS";
  }
  return null;
}
