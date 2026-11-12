# Change protocol

1. Read AGENTS.md, current state and relevant launch decision/source files. Confirm
   root/status; preserve pre-existing changes and identify exact authorised outcome.
2. Classify LOW/MEDIUM/HIGH/CRITICAL; for multi-step work keep a brief checklist of
   intended files, verification and material risks. Avoid unrelated redesign.
3. Implement the smallest coherent local change. Use synthetic fixtures and existing
   patterns; no speculative upgrades or additional tools for checklist compliance.
4. Verify: diff → focused tests → relevant lint/types → integration/regression →
   full build/suite when risk or project policy requires. Inspect scripts/settings
   before commands that can contact CMS/providers or write artifacts.
5. Review invariants/failure paths, record evidence once and reconcile current state.
6. Finish using response-style.md. For actions needing approval, first prepare the
   concrete reviewable target, impact and recovery plan; request approval once.

Prior scope approval persists. Development/content approval does not authorise
production, push/merge/release, provider changes or changes to protected gates.
