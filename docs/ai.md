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
