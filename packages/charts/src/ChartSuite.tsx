import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import { Info } from "lucide-react";

export interface ChartProps {
  title?: string;
  subtitle?: string;
  data: any[];
  dataKey?: string;
  xKey?: string;
  keys?: string[];
  onOpenEvidence?: (evidenceId?: string) => void;
  onClick?: (entry: any) => void;
}

const COLOR_PALETTE = ["#D95300", "#06038D", "#046A38", "#B45309", "#2563EB", "#7C3AED"];

export const GenericBarChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  data = [],
  dataKey,
  xKey,
  keys,
  onClick,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-5 rounded-lg shadow-xs font-sans text-center text-xs font-mono text-[#4B5563]">
        No visualization data available for this query.
      </div>
    );
  }

  // 1. Auto-detect X axis key if not explicitly given
  const sample = data[0] || {};
  const resolvedXKey =
    xKey ||
    ["metric", "category", "year", "name", "stage", "label"].find((k) => k in sample) ||
    Object.keys(sample)[0];

  // 2. Auto-detect Y bar keys if multi-series or single series
  let barKeys: string[] = [];
  if (keys && keys.length > 0) {
    barKeys = keys;
  } else if (dataKey) {
    barKeys = [dataKey];
  } else {
    barKeys = Object.keys(sample).filter(
      (k) => k !== resolvedXKey && typeof sample[k] === "number"
    );
    if (barKeys.length === 0) {
      barKeys = Object.keys(sample).filter((k) => k !== resolvedXKey);
    }
  }

  // For charts with many items (e.g. > 6 parties), ensure enough minWidth so bars don't squish
  const needsHorizontalScroll = data.length > 6;
  const calculatedMinWidth = needsHorizontalScroll ? Math.max(320, data.length * 48) : "100%";

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-4 sm:p-5 rounded-xl shadow-xs font-sans">
      {title && (
        <div className="mb-3 sm:mb-4">
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">{title}</h4>
          {subtitle && <p className="text-[11px] sm:text-xs font-mono text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Responsive container wrapper with horizontal swipe support for many items */}
      <div className="w-full overflow-x-auto scrollbar-none -mx-1 px-1">
        <div style={{ width: calculatedMinWidth, minWidth: "100%", height: "290px" }}>
          <ResponsiveContainer width="100%" height={290}>
            <RechartsBarChart
              data={data}
              margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" vertical={false} />
              <XAxis
                dataKey={resolvedXKey}
                tick={{ fill: "#0F172A", fontSize: 10, fontFamily: "JetBrains Mono", fontWeight: 500 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={40}
                dy={6}
                tickFormatter={(val: any) => {
                  if (!val) return "";
                  const str = String(val);
                  return str.length > 12 ? str.slice(0, 10) + "…" : str;
                }}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
                width={40}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  color: "#FAF7F0",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "JetBrains Mono",
                  border: "1px solid #334155",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                itemStyle={{ color: "#FAF7F0" }}
                labelStyle={{ color: "#FF671F", fontWeight: "bold" }}
              />
              {barKeys.length > 1 && (
                <Legend
                  wrapperStyle={{ paddingTop: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  iconSize={10}
                />
              )}
              {barKeys.map((keyName, idx) => (
                <Bar
                  key={keyName}
                  dataKey={keyName}
                  fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                  onClick={(entry: any) => onClick && onClick(entry)}
                  className={onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E8DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-[#64748B]">
        <span>SOURCE: Official Primary Records</span>
        <span className="flex items-center gap-1 text-[#D95300] font-bold cursor-pointer hover:underline">
          <Info className="w-3.5 h-3.5" /> View Evidence Reference
        </span>
      </div>
    </div>
  );
};

export const GenericLineChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  data = [],
  dataKey,
  xKey,
  keys,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-5 rounded-lg shadow-xs font-sans text-center text-xs font-mono text-[#4B5563]">
        No visualization data available for this query.
      </div>
    );
  }

  const sample = data[0] || {};
  const resolvedXKey =
    xKey ||
    ["year", "date", "metric", "category", "name", "label"].find((k) => k in sample) ||
    Object.keys(sample)[0];

  let lineKeys: string[] = [];
  if (keys && keys.length > 0) {
    lineKeys = keys;
  } else if (dataKey) {
    lineKeys = [dataKey];
  } else {
    lineKeys = Object.keys(sample).filter(
      (k) => k !== resolvedXKey && typeof sample[k] === "number"
    );
    if (lineKeys.length === 0) lineKeys = Object.keys(sample).filter((k) => k !== resolvedXKey);
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-4 sm:p-5 rounded-xl shadow-xs font-sans">
      {title && (
        <div className="mb-3 sm:mb-4">
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">{title}</h4>
          {subtitle && <p className="text-[11px] sm:text-xs font-mono text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="w-full" style={{ height: "290px" }}>
        <ResponsiveContainer width="100%" height={290}>
          <RechartsLineChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" vertical={false} />
            <XAxis
              dataKey={resolvedXKey}
              tick={{ fill: "#0F172A", fontSize: 10, fontFamily: "JetBrains Mono" }}
              interval="preserveStartEnd"
              minTickGap={16}
              angle={-20}
              textAnchor="end"
              height={36}
              dy={4}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              width={40}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                color: "#FAF7F0",
                borderRadius: "8px",
                fontSize: "11px",
                fontFamily: "JetBrains Mono",
                border: "1px solid #334155",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              itemStyle={{ color: "#FAF7F0" }}
              labelStyle={{ color: "#FF671F", fontWeight: "bold" }}
            />
            {lineKeys.length > 1 && (
              <Legend
                wrapperStyle={{ paddingTop: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                iconSize={10}
              />
            )}
            {lineKeys.map((keyName, idx) => (
              <Line
                key={keyName}
                type="monotone"
                dataKey={keyName}
                stroke={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                strokeWidth={2.5}
                dot={{ fill: COLOR_PALETTE[idx % COLOR_PALETTE.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 pt-2.5 border-t border-[#E8DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-[#64748B]">
        <span>SOURCE: National Data Indicators</span>
        <span className="flex items-center gap-1 text-[#D95300] font-bold cursor-pointer hover:underline">
          <Info className="w-3.5 h-3.5" /> View Evidence Reference
        </span>
      </div>
    </div>
  );
};

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  onEvidence?: () => void;
}> = ({ label, value, change, subtitle, onEvidence }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-4 sm:p-5 rounded-xl shadow-xs font-sans hover:border-[#FF671F] transition-colors relative group">
      <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider block">{label}</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">{value}</span>
        {change && <span className="font-mono text-xs text-[#046A38] font-semibold">{change}</span>}
      </div>
      {subtitle && <p className="text-[11px] font-mono text-[#64748B] mt-1.5">{subtitle}</p>}
      {onEvidence && (
        <button
          onClick={onEvidence}
          className="mt-2.5 text-[11px] font-mono text-[#D95300] font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Info className="w-3 h-3" /> EVIDENCE REFERENCE →
        </button>
      )}
    </div>
  );
};

export interface PartyIncomeTrendChartProps {
  data: any[];
  parties: string[];
  partyColors?: Record<string, string>;
  title?: string;
  subtitle?: string;
  sourceText?: string;
  onOpenEvidence?: () => void;
}

const DEFAULT_PARTY_COLORS: Record<string, string> = {
  BJP: "#FF671F",
  INC: "#046A38",
  TMC: "#008080",
  BRS: "#E91E63",
  BJD: "#2E7D32",
  DMK: "#C62828",
  AAP: "#0288D1",
  CPM: "#D32F2F",
  BSP: "#1976D2",
  SP: "#388E3C",
  TDP: "#FBC02D",
  YSRCP: "#0D47A1",
  others: "#64748B",
  total: "#0F172A",
};

export const PartyIncomeTrendChart: React.FC<PartyIncomeTrendChartProps> = ({
  data = [],
  parties = ["BJP", "INC", "TMC", "BRS", "DMK"],
  partyColors = {},
  title,
  subtitle,
  sourceText = "ECI Audited Annual Accounts & ADR Disclosures (2004–2025)",
  onOpenEvidence,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-5 rounded-lg shadow-xs font-sans text-center text-xs font-mono text-[#475569]">
        No historical party income data available for this range.
      </div>
    );
  }

  const mergedColors = { ...DEFAULT_PARTY_COLORS, ...partyColors };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEC8] p-4 sm:p-6 rounded-xl shadow-xs font-sans space-y-3 sm:space-y-4">
      {title && (
        <div className="border-b border-[#E8DEC8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">{title}</h4>
            {subtitle && <p className="text-[11px] sm:text-xs font-mono text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          <span className="font-mono text-[11px] text-[#06038D] font-bold bg-[#FAF7F0] px-2.5 py-0.5 rounded border border-[#E8DEC8] self-start sm:self-auto">
            Annual Income (₹ Cr)
          </span>
        </div>
      )}

      <div className="w-full" style={{ height: "340px" }}>
        <ResponsiveContainer width="100%" height={340}>
          <RechartsLineChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "#0F172A", fontSize: 10, fontFamily: "JetBrains Mono", fontWeight: 600 }}
              interval="preserveStartEnd"
              minTickGap={20}
              tickFormatter={(val: string) => {
                if (!val) return "";
                const m = val.match(/20(\d\d)-(\d\d)/);
                if (m) return `FY${m[2]}`;
                return val;
              }}
              dy={4}
              height={30}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              width={42}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const record = payload[0]?.payload;
                return (
                  <div className="bg-[#0F172A] text-[#FAF7F0] p-3 rounded-lg shadow-xl border border-[#334155] font-mono text-xs min-w-[210px] space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#334155] pb-1">
                      <span className="font-serif font-bold text-sm text-[#FF671F]">{label} (FY {record?.fy})</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1E293B] text-[#94A3B8] font-semibold">{record?.era}</span>
                    </div>

                    {record?.isElectionYear && (
                      <div className="text-[9.5px] bg-[#D95300]/20 text-[#FF671F] px-1.5 py-0.5 rounded font-bold border border-[#D95300]/40">
                        🗳️ {record.electionNote}
                      </div>
                    )}

                    {record?.eventNote && (
                      <p className="text-[10px] text-[#CBD5E1] font-sans leading-tight border-b border-[#334155] pb-1">
                        {record.eventNote}
                      </p>
                    )}

                    <div className="space-y-0.5 pt-0.5">
                      {payload.map((entry: any) => (
                        <div key={entry.dataKey} className="flex justify-between items-center text-[11px]">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="font-bold">{entry.dataKey}:</span>
                          </span>
                          <span className="font-bold text-[#FAF7F0]">₹{Number(entry.value).toLocaleString()} Cr</span>
                        </div>
                      ))}
                      {record?.total && (
                        <div className="flex justify-between items-center text-[11px] border-t border-[#334155] pt-1 font-bold text-[#FFD180]">
                          <span>All Parties:</span>
                          <span>₹{record.total.toLocaleString()} Cr</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "8px", fontSize: "10.5px", fontFamily: "JetBrains Mono", fontWeight: "bold" }}
              iconSize={8}
            />
            {parties.map((partyName) => (
              <Line
                key={partyName}
                type="monotone"
                dataKey={partyName}
                name={partyName}
                stroke={mergedColors[partyName] || "#0F172A"}
                strokeWidth={2.4}
                dot={{ fill: mergedColors[partyName] || "#0F172A", r: 3.5 }}
                activeDot={{ r: 6, stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-mono text-[#64748B]">
        <span>SOURCE: {sourceText}</span>
        {onOpenEvidence && (
          <button
            onClick={onOpenEvidence}
            className="flex items-center gap-1 text-[#D95300] font-bold hover:underline cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" /> View ECI Audit Filing
          </button>
        )}
      </div>
    </div>
  );
};
