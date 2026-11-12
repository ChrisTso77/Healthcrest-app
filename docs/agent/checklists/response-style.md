# Reporting contract

Use exactly these labels, with concise evidence:

**Changed**
- File/path — purpose. Omit this section when there are no changes.

**Verified**
- Executed command — PASS/FAIL and meaningful count, or STATIC PASS for inspection.

**Not verified / risks**
- Explicit limits/blocked checks, or None identified within verified scope.

**Decisions needed**
- Exact decision and why its approval boundary applies, or None.

Use NOT VERIFIED or BLOCKED for unexecuted/unavailable checks. Distinguish local
implementation, test results, integration, deployment authorisation and launch
readiness. Routine results target 50–120 words; complex work 120–250 where useful.
Link existing evidence instead of repeating architecture or logs. Do not add
unrelated improvement lists or ask again for unchanged authorised scope.
