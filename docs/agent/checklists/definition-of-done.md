# Definition of done

- Requested outcome and risk-based acceptance criteria satisfied within scope.
- Actual diff reviewed; unrelated user changes preserved and no sensitive data added.
- Relevant focused tests and lint/type/build checks executed as risk requires;
  document command outcomes and limitations, never infer PASS.
- Planner recoverability, reviewed content, privacy defaults and release assertions
  preserved where affected; mandatory security gates pass or explicitly block release.
- No unexplained regression; required failure paths and HIGH-risk tests covered.
- Current state updated only for material changes; decisions/lessons only if warranted.
- No unapproved external writes, push, merge, deployment, CMS write or paid service.
- Use the reporting contract; stop on completion. Local success is not launch approval.
- Documentation-only changes: inspect diff, local links and applicable line budgets;
  do not rerun application suites without a relevant reason.
