# Central publication repository — Dr Sathish Muthu

The single source of Dr Muthu's indexed publications, used for self-citation in every manuscript and for the publication list on this site.

| File | Contents |
|---|---|
| `sathish_muthu_publications.bib` | Master BibTeX, one entry per unique work (no abstracts) |
| `sathish_muthu_publications.csv` | The same records as a table |
| `indexing_statistics.md` | Per-database and overall indexing statistics, deduplication log |
| `pdf_index.csv` | Full-text PDF library index: one row per work (same `uid`), with `pdf_status` and the PDF's file name in the library folder |

## Full-text PDF library

The PDFs themselves are not in this repository (publisher copyright). They live in one flat Google Drive folder:

- Drive folder: **Research / Published PDFs** (Drive ID `1Sagok89ty0ffglQcRpK6S3z-xh7Nu9S2`); on the Clinic PC `D:\My Drive\Research\Published PDFs`
- File names: `Year_FirstAuthor_ShortTitle.pdf`; certificates, conference abstracts, author lists, the MS thesis and alternate copies are in the `_Other` subfolder
- `pdf_index.csv` maps each `uid` to its file (`pdf_file`); `pdf_status` is one of `in folder`, `downloaded (open access)`, `free to read - auto-download blocked`, `paywalled`, `no DOI`, `not fetched (non-citable item)`; `get_it_here` links missing works
- The same index is kept in the folder as `_PDF_INDEX.csv`, and `_TO_DOWNLOAD.csv` there lists citable works still without a PDF, with the file name to save each under

To open a paper in a Claude session: look up its `uid` in `pdf_index.csv`, then search Drive for the `pdf_file` name inside the folder above.

Raw URL: https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/pdf_index.csv

**Current version:** 447 works (2 added 25 Nov 2026 from Google Scholar / Crossref).

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

In the CSV, `citable` is `True` for citable works (a work without a DOI is never citable); other values say why not (conference abstract/poster, BMJ rapid response, convocation proceedings) or flag a preprint under review.

## Raw URLs (for scripts and Claude)

- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.bib
- https://raw.githubusercontent.com/drsathishmuthu/drsathishmuthu.github.io/main/publications/sathish_muthu_publications.csv

## Updating

ResearchGate-only works without a DOI (34: conference abstracts and posters, and five early papers in journals that do not issue DOIs) carry the title, journal, year and ResearchGate link; DOIs and full author lists for these can be added from their ResearchGate records.


Export fresh records from Scopus (BibTeX), Web of Science (BibTeX) and PubMed (MEDLINE), rerun the merge, and replace these three files. Works published after the last export date are not yet in this file and must be added by hand when citing.
