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
];

function titleTeam(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function extractSportsTeams(text: string): string[] {
  const low = text.toLowerCase();
  return TEAM_NAMES.filter((t) => low.includes(t)).map(titleTeam);
}

export interface SportsResultSides {
  winner?: string;
  loser?: string;
}

function teamIn(fragment: string, teams: string[]): string | undefined {
  const f = fragment.toLowerCase();
  return teams.find((t) => f.includes(t.toLowerCase()));
}

export function parseSportsResult(text: string): SportsResultSides {
  const teams = extractSportsTeams(text);
  if (teams.length < 1) return {};
  const t = text.replace(/\s+/g, " ");

  const beat = t.match(
    /\b(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b[^.]{0,50}\b(beat|defeated|thrashed)\b[^.]{0,40}\b(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b/i
  );
  if (beat) {
    return { winner: titleTeam(beat[1].toLowerCase()), loser: titleTeam(beat[3].toLowerCase()) };
  }

  const wonAgainst = t.match(
    /\b(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b[^.]{0,50}\bwon\b[^.]{0,40}\b(?:against|vs\.?)\s+(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b/i
  );
  if (wonAgainst) {
    return { winner: titleTeam(wonAgainst[1].toLowerCase()), loser: titleTeam(wonAgainst[2].toLowerCase()) };
  }

  const lostTo = t.match(
    /\b(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b[^.]{0,40}\blost to\b[^.]{0,30}\b(bangladesh|australia|england|india|pakistan|sri lanka|new zealand|south africa|west indies|afghanistan|ireland|zimbabwe)\b/i
  );
  if (lostTo) {
    return { winner: titleTeam(lostTo[2].toLowerCase()), loser: titleTeam(lostTo[1].toLowerCase()) };
  }

  return {};
}

export function sportsResultConflict(claim: string, evidence: string): "SUPPORTS" | "CONTRADICTS" | null {
  const claimSides = parseSportsResult(claim);
  if (!claimSides.winner) return null;
  const evSides = parseSportsResult(evidence);
  if (evSides.winner && evSides.loser && claimSides.loser) {
    if (evSides.winner.toLowerCase() === claimSides.winner.toLowerCase() && evSides.loser.toLowerCase() === claimSides.loser.toLowerCase()) {
      return "SUPPORTS";
    }
    if (evSides.winner.toLowerCase() === claimSides.loser.toLowerCase() && evSides.loser.toLowerCase() === claimSides.winner.toLowerCase()) {
      return "CONTRADICTS";
    }
  }
  const teams = extractSportsTeams(claim);
  const elow = evidence.toLowerCase();
  const allTeamsPresent = teams.every((t) => elow.includes(t.toLowerCase()));
  const winCue = /\b(won|beat|defeated|victory|win)\b/i.test(evidence);
  if (!allTeamsPresent || !winCue || !claimSides.winner) return null;
  const winner = claimSides.winner.toLowerCase();
  const loser = (claimSides.loser || "").toLowerCase();
  if (loser && new RegExp(`${loser}.{0,50}(beat|defeated|thrashed|won).{0,40}${winner}`, "i").test(evidence)) {
    return "CONTRADICTS";
  }
  if (new RegExp(`${winner}.{0,80}(beat|defeated|thrashed|won|victory|win)`, "i").test(evidence)) {
    return "SUPPORTS";
  }
  return null;
}
