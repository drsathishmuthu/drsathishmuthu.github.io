# Central publication repository — Dr Sathish Muthu

The single source of Dr Muthu's indexed publications, used for self-citation in every manuscript and for the publication list on this site.

| File | Contents |
|---|---|
| `sathish_muthu_publications.bib` | Master BibTeX, one entry per unique work (no abstracts) |
| `sathish_muthu_publications.csv` | The same records as a table |
| `indexing_statistics.md` | Per-database and overall indexing statistics, deduplication log |

**Current version:** 445 works.

- 344 works from the Scopus, Web of Science and PubMed author-profile exports of 6 November 2026 (825 raw records deduplicated by DOI, PMID and normalised title + year).
- 101 further works from the ResearchGate profile (519 items, extracted 15–16 November 2026) that are not in those three exports: early unindexed journal articles, conference abstracts and posters, chapters, preprints and recent papers. Each was checked against the 344 by normalised title and DOI, and DOIs and author lists were taken from Crossref where a record exists. ResearchGate dataset/figure items (52) were left out.

This repository is the complete list of Dr Muthu's publications. Use it for all self-citation and publication lists; do not ask him for his publications.

## Custom fields

- `indexed_in`: which of Scopus, Web of Science and PubMed index the work
- `role`: First author, Last author, Co-author, Co-author (consortium paper), Group/consortium collaborator
- `author_position`: e.g. `1 of 6`
- `citable`: `NO - do not cite` for retracted papers, retraction notices, corrections and book prefaces
- `citations_scopus`, `citations_wos`: counts at export date
- `uid`: stable record ID (SM0001…)
- `source`: `Scopus/WoS/PubMed export (6 Nov 2026)` or `ResearchGate`
- `rg_url`, `rg_type`: ResearchGate record and item type (ResearchGate-sourced works only)

In the CSV, `citable` is `True` for citable works; other values say why not (conference abstract/poster, BMJ rapid response, convocation proceedings) or flag a preprint under review.

## Raw URLs (for scripts and Claude)

- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.bib
- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.csv

## Updating

ResearchGate-only works without a DOI (34, mostly conference abstracts and posters) carry the title, journal, year and ResearchGate link; DOIs and full author lists for these can be added from their ResearchGate records.


Export fresh records from Scopus (BibTeX), Web of Science (BibTeX) and PubMed (MEDLINE), rerun the merge, and replace these three files. Works published after the last export date are not yet in this file and must be added by hand when citing.
