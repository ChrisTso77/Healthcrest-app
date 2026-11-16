import { claimById, sourceById } from '@/lib/education/library/catalogue';

export function ClaimLinks({ ids }: { ids: readonly string[] }) {
  return ids.length ? <p className="hc-education-citations">Evidence: {ids.map(id => <a key={id} href={'/learn/library#claim-' + id}>{id} </a>)}</p> : null;
}

export function EducationEvidence({ ids }: { ids: readonly string[] }) {
  return <div className="hc-education-evidence">{ids.map(id => {
    const claim = claimById(id);
    if (!claim) throw new Error('Unknown evidence claim: ' + id);
    return <details key={id} id={'claim-' + id}>
      <summary>{id}: {claim.scientificClaim}</summary>
      <p><strong>Certainty:</strong> {claim.certainty}. {claim.certaintyRationale}</p>
      <p><strong>Assessment method:</strong> {claim.certaintyMethod}. <strong>Inference:</strong> {claim.inference}.</p>
      <p><strong>Population:</strong> {claim.population} <strong>Region:</strong> {claim.geographicalRelevance.join(', ')}.</p>
      <p><strong>Conflicting findings and limits:</strong> {claim.contradictoryEvidence}</p>
      <p><strong>Source check:</strong> {claim.lastVerificationDate}. <strong>Verification:</strong> {claim.verificationStatus}. <strong>Publication:</strong> draft; independent clinical review pending.</p>
      <ul>{claim.supportingReferences.map(sourceId => {
        const source = sourceById(sourceId);
        if (!source) throw new Error('Unknown evidence source: ' + sourceId);
        return <li key={source.id}>
          <a href={source.url}>{source.title}</a>
          <p>{source.authors.join(', ')}. {source.publicationDate ?? 'Publication date not captured'}. {source.updatedOn && 'Source reviewed/updated ' + source.updatedOn + '.'}</p>
          <p>{source.kind} · {source.accessLevel}. {source.doi && 'DOI: ' + source.doi + '. '}{source.pmid && 'PMID: ' + source.pmid + '.'}</p>
          <p>{source.limitations}</p>
        </li>;
      })}</ul>
    </details>;
  })}</div>;
}
