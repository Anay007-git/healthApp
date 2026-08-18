# CivicLens AI Engine Architecture (`Ask the Data`)

## Design Principles

1. **Strict Data-First Tool Execution**: The AI does not invent or hallucinate metrics out of thin air.
2. **Structured JSON Output**: Standardized response format consumed directly by frontend chart components.

```json
{
  "answer": "Text explanation",
  "metrics": [{ "label": "Literacy Rate", "value": "84.8%" }],
  "visualization": {
    "type": "bar",
    "title": "State Comparison",
    "data": []
  },
  "sources": [],
  "confidence": "HIGH",
  "methodology": "Verified from NFHS-5 factsheets"
}
```

3. **Supported Visualization Types**: `stat`, `table`, `line`, `bar`, `area`, `scatter`, `map`, `timeline`, `comparison`, `sankey`, `evidence_graph`.

## TruthCheck™ evidence-first pipeline

`POST /api/factcheck/verify` still returns `ClaimAnalysisResult`. Internally it runs:

1. Claim sanitization (length limits; untrusted input)
2. Atomic decomposition
3. Semantic topic classification
4. Dynamic source planning (primary official sources first)
5. Parallel evidence retrieval with timeouts
6. Source-quality scoring (quality ≠ truth)
7. Claim↔evidence matching (entities, event dates vs publication dates, normalized numbers)
8. Contradiction / allocation-vs-expenditure detection
9. Optional LLM reasoning **only over supplied evidence** (`AI_API_KEY`)
10. Verdict + evidence-based confidence

Google News, Wikipedia, and DuckDuckGo Instant Answers are **discovery/context**. They never independently produce `VERIFIED_TRUE`. `FACT_CHECK_CLAIMS` is a high-value cache used only on strong semantic match (entities, dates, numbers, direction)—not keyword overlap.

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `AI_API_KEY` | No | If set, LLM reasons over structured evidence only. Missing key → deterministic engine. |
| `AI_PROVIDER` | No | Default `openai` |
| `AI_MODEL` | No | Default `gpt-4o-mini` |
| `SEARCH_API_KEY` | No | Reserved; discovery uses public Google News RSS / Wikipedia / DuckDuckGo |

Never put API keys in frontend code.

