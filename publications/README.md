# Central publication repository — Dr Sathish Muthu

The single source of Dr Muthu's indexed publications, used for self-citation in every manuscript and for the publication list on this site.

| File | Contents |
|---|---|
| `sathish_muthu_publications.bib` | Master BibTeX, one entry per unique work (no abstracts) |
| `sathish_muthu_publications.csv` | The same records as a table |
| `indexing_statistics.md` | Per-database and overall indexing statistics, deduplication log |

**Current version:** Scopus, Web of Science and PubMed author-profile exports of 6 November 2026. 825 raw records were deduplicated to 344 unique works by three methods (DOI, PMID, normalised title + year).

## Custom fields

- `indexed_in`: which of Scopus, Web of Science and PubMed index the work
- `role`: First author, Last author, Co-author, Co-author (consortium paper), Group/consortium collaborator
- `author_position`: e.g. `1 of 6`
- `citable`: `NO - do not cite` for retracted papers, retraction notices, corrections and book prefaces
- `citations_scopus`, `citations_wos`: counts at export date
- `uid`: stable record ID (SM0001…)

## Raw URLs (for scripts and Claude)

- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.bib
- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.csv

## Updating

Export fresh records from Scopus (BibTeX), Web of Science (BibTeX) and PubMed (MEDLINE), rerun the merge, and replace these three files. Works published after the last export date are not yet in this file and must be added by hand when citing.
