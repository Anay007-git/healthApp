# CivicLens Database & ERD Documentation

## Core Data Schema

The database is designed around strict evidence traceability:

```text
+-------------------+       +-------------------+       +-------------------+
|      Source       | <---- |     Document      | <---- |     Evidence      |
+-------------------+       +-------------------+       +-------------------+
  - id                        - id                        - id
  - name                      - title                     - claim
  - publisher                 - url                       - evidenceSummary
  - url                       - checksum                  - sourceId
                                                          - pageNumber
                                                          - verificationStatus
                                                                  |
                                                                  v
                                                        +-------------------+
                                                        | Scheme / CAG /    |
                                                        | State Indicator   |
                                                        +-------------------+
```

## Primary Entities

- `sources`: Government reports, CAG audits, budget documents, ECI candidate affidavits.
- `evidences`: Specific verifiable claims tied to primary sources, document page numbers, and verification statuses.
- `schemes`: Union & State government schemes with budget allocation, expenditure, and Promise-to-Outcome pipeline steps.
- `states`: 28 States and 8 UT profiles with category scores and indicator values (NFHS-5, MOSPI).
- `cag_reports` & `cag_findings`: Comptroller and Auditor General findings categorized by severity and financial impact.
- `subscribers` & `newsletter_campaigns`: The Civic Brief subscription subsystem.
- `audit_logs`: Immutable tracking of admin data edits.
