export interface ExtractedNumber {
  raw: string;
  value: number;
  unit: string;
  inr?: number;
}

const CRORE = 1e7;
const LAKH = 1e5;

export function normalizeAmountToInr(value: number, unit: string): number | undefined {
  const u = unit.toLowerCase();
  if (u.includes("crore") || u === "cr") return value * CRORE;
  if (u.includes("lakh")) return value * LAKH;
  if (u.includes("billion")) return value * 1e9;
  if (u.includes("million")) return value * 1e6;
  if (u.includes("thousand") || u === "k") return value * 1e3;
  if (u.includes("percent") || u === "%" || u.includes("pct")) return undefined;
  return value;
}

export function extractNumbers(text: string): ExtractedNumber[] {
  const out: ExtractedNumber[] = [];
  const re =
    /(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakh|million|billion|thousand|%|percent|per cent)?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (!Number.isFinite(value)) continue;
    const unit = (m[2] || "").toLowerCase();
    if (!unit && value >= 1900 && value <= 2100 && Number.isInteger(value)) {
      continue;
    }
    out.push({
      raw: m[0].trim(),
      value,
      unit: unit || "count",
      inr: normalizeAmountToInr(value, unit),
    });
  }
  return out;
}

export function extractYears(text: string): number[] {
  const years = text.match(/\b(19\d{2}|20\d{2})\b/g) || [];
  return Array.from(new Set(years.map((y) => parseInt(y, 10))));
}

/** Exact numeric match after unit normalization. Approximate matches are not exact. */
export function numbersAlign(claimNums: ExtractedNumber[], evidenceNums: ExtractedNumber[]): {
  exact: boolean;
  contradicted: boolean;
  score: number;
} {
  if (claimNums.length === 0) return { exact: true, contradicted: false, score: 70 };

  let exactHits = 0;
  let contradictions = 0;

  for (const cn of claimNums) {
    const candidates = evidenceNums.filter((en) => {
      const samePercent = (cn.unit.includes("%") || cn.unit.includes("percent")) &&
        (en.unit.includes("%") || en.unit.includes("percent"));
      const bothMoney = cn.inr != null && en.inr != null;
      const bothCount = cn.inr == null && en.inr == null && !cn.unit.includes("%") && !en.unit.includes("%");
      return samePercent || bothMoney || bothCount;
    });
    if (candidates.length === 0) continue;

    const hit = candidates.some((en) => valuesEqual(cn, en));
    const nearButNotEqual = candidates.some((en) => valuesClose(cn, en) && !valuesEqual(cn, en));
    if (hit) exactHits += 1;
    else if (nearButNotEqual || candidates.length > 0) contradictions += 1;
  }

  if (contradictions > 0 && exactHits === 0) {
    return { exact: false, contradicted: true, score: 10 };
  }
  if (exactHits > 0) {
    return { exact: true, contradicted: false, score: 95 };
  }
  return { exact: false, contradicted: false, score: 45 };
}

function valuesEqual(a: ExtractedNumber, b: ExtractedNumber): boolean {
  if (a.inr != null && b.inr != null) {
    return Math.abs(a.inr - b.inr) / Math.max(a.inr, 1) < 0.001;
  }
  return Math.abs(a.value - b.value) < 1e-6;
}

function valuesClose(a: ExtractedNumber, b: ExtractedNumber): boolean {
  const av = a.inr ?? a.value;
  const bv = b.inr ?? b.value;
  const denom = Math.max(Math.abs(av), 1);
  const rel = Math.abs(av - bv) / denom;
  return rel > 0.001 && rel <= 0.15;
}

export function isAllocationLanguage(text: string): boolean {
  return /\b(allocat|outlay|budgeted|earmarked|sanctioned)\b/i.test(text);
}

export function isExpenditureLanguage(text: string): boolean {
  return /\b(spent|expenditure|disbursed|utili[sz]ed|released|actual spend)\b/i.test(text);
}
