# Control assurance register — 13 November 2026

New assessment under adopted policy; not recovered historical evidence.

| Control | Status | Evidence | Acceptance / next action |
| --- | --- | --- | --- |
| ASVS5.0.0-14.3.3 sensitive browser storage | FAIL | Frozen9d5dbca HabitPlanner.tsx:75–81 serializes classified potentially sensitive reflection/week text into localStorage; habitDraft.ts:5; disclosed storage risks | Targeted qualified reviewer recommends minimisation/storage treatment. Record any risk acceptance as nonconformance; no ASVS PASS inferred. No data deletion/redesign authorised. |
| Applicable external obligations established | NOT VERIFIED | General public terms reviewed; private contracts/insurance/account-specific terms absent | Owner/broker/provider evidence of actual requirements or accountable no-applicable-requirement outcome; stricter obligations prevail. |
| Independent human security review | BLOCKED | No appointed qualified assessor/report | Obtain attributable review,permitted validation,retests and material-risk disposition. |
| Vercel Hobby penetration-test permission | Prohibited | Official provider policy referenced in adopted amendment | Source/offline synthetic review initially; no active Hobby pentest or inferred owner override. |

Canonical matrix remains34requirements. Its existing Planner PASS covers only
bounded parsing,scoped keys and manual save/restore integrity,not confidentiality
or ASVS14.3.3. The security gate remains BLOCKED with this underlying FAIL explicit.
No extra requirement is silently counted as a35th row. Status counts unchanged by
adoption; launch cannot be inferred from the narrow Planner PASS.
