# Finding guidance with several search words

The learning library now matches all search words in any order within each topic, glossary entry or evidence label. Case, accents, apostrophes, punctuation and repeated whitespace are normalised. Partial-word matching remains available for familiar acronyms or unfinished terms. This is deterministic catalogue search, without semantic diagnosis, symptom interpretation, typo correction or generated advice.

A blank/whitespace query browses everything. A non-empty punctuation-only query finds nothing. The existing 120-character limit remains in both the input and matcher. Query text is not treated as a regular expression.

Topics additionally index source titles, publishers, information types, supported claims and limits from the existing guide catalogue. The additional source index does not include URL strings. For a matching guide section or source, the result provides a direct link to that existing anchor; all search words must occur in that section or source before it is labelled a match. A result matched elsewhere in the wider topic can still appear without a section pointer. Catalogue order determines the first pointer. A pointer identifies relevant text, not an evidence-quality ranking.

The full guide retains the context and scope around source claims. No medical wording, source-check date, canonical route or institutional endorsement changes. The library introduction and metadata now acknowledge the international references already present alongside NHS material. No fresh clinical review is asserted.

Search stays in component memory and is not placed in URLs, storage or a custom measurement event. Destination URLs contain only catalogue paths/anchors and an existing allowlisted practical preference when present. Clearing restores all entries and keyboard focus. There is no remote search service, request endpoint or dependency. Existing no-JavaScript topic/definition browsing is unchanged.

Verification covers word order, accents, punctuation, partial acronyms, all-word matching, bounded and literal input, exact catalogue section/source targets, four international guide journeys, source-scope discovery, keyboard recovery at 320/1440px, and query isolation from URLs/storage/network requests.
