export const CANONICAL_ORIGIN: string;
export const RELEASE_HEADER: string;
export function buildReleaseHeaders(environment: Record<string, string | undefined>): Array<{ key: string; value: string }>;
export function releaseTarget(environment: Record<string, string | undefined>): { origin: string; suppliedOrigin: boolean; expectedCommit: string | null; mode: string };
export function assertReleaseCommit(observed: string | null | undefined, expected: string | null | undefined): string;
export function releaseProvenance(environment: Record<string, string | undefined>): { sourceCommit: string | null; event: string | null; checkoutScope: string; workflowRunUrl: string | null };
