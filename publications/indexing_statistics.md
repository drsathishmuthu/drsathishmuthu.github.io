# Publication indexing statistics — Dr Sathish Muthu
Source exports: Scopus (.bib), Web of Science (savedrecs .bib), PubMed (MEDLINE .txt), all exported from author profiles on 6 November 2026.

## 1. Records per database (as exported)

| Database | Records exported | With DOI | Year range | Unique to this database |
|---|---|---|---|---|
| Scopus | 277 | 277 | 2019–2026 | 23 |
| Web of Science | 247 | 246 | 2020–2026 | 2 |
| PubMed | 301 | 301 | 2019–2027 | 47 |
| **Total raw records** | **825** | | | |

## 2. Deduplication (three methods)

| Method | Matching rule | Cross-database duplicate pairs found |
|---|---|---|
| 1. DOI | Exact match on normalised DOI (lower-case, URL prefix and BibTeX escapes stripped) | 688 |
| 2. PMID | Exact PubMed ID (Scopus PMID field vs PubMed record) | 90 |
| 3. Title + year | Exact match on normalised title (alphanumerics only, ≥25 characters) with publication year within ±1 | 674 |
| Union of the three methods | Records linked by any method (union–find clustering) | 690 |

Pairs found by one method only: DOI 12, PMID 0, title 2. Pairs found by all three: 86.

**Conflict resolution.** Clusters were flagged when they held two records from the same database or when their DOIs disagreed. One cluster was flagged: Scopus holds two separate records for the same 2021 BMJ Case Reports paper (doi:10.1136/bcr-2020-235888, "Sudden painless loss of vision following spine surgery"), with different author orders. Both carry the same DOI and match the WoS and PubMed records, so they were merged into one work; the Scopus profile duplicate can be reported to Scopus for merging. A fuzzy title check (sequence ratio >0.85) across the unmatched records found one near-match: the Lancet Infectious Diseases GBD enteric infections article and its published correction. These have different DOIs and are different items, so they were kept separate.

**Result: 825 raw records → 344 unique works** (481 duplicates removed).

## 3. Overlap of indexing

| Indexed in | Works |
|---|---|
| Scopus + Web of Science + PubMed | 208 |
| Scopus + PubMed | 27 |
| Web of Science + PubMed | 19 |
| Scopus + Web of Science | 18 |
| PubMed only | 47 |
| Scopus only | 23 |
| Web of Science only | 2 |
| **Any database** | **344** |

- Coverage of the 344 unique works by Scopus: 276 (80.2%)
- Coverage of the 344 unique works by Web of Science: 247 (71.8%)
- Coverage of the 344 unique works by PubMed: 301 (87.5%)

## 4. Unique works by year

| Year | Works | Scopus | WoS | PubMed |
|---|---|---|---|---|
| 2027 | 1 | 0 | 0 | 1 |
| 2026 | 93 | 72 | 71 | 74 |
| 2025 | 79 | 70 | 59 | 69 |
| 2024 | 52 | 39 | 37 | 46 |
| 2023 | 27 | 19 | 18 | 26 |
| 2022 | 38 | 34 | 30 | 35 |
| 2021 | 41 | 31 | 23 | 38 |
| 2020 | 10 | 9 | 9 | 10 |
| 2019 | 3 | 2 | 0 | 2 |

## 5. Document type (harmonised across databases)

| Type | Works |
|---|---|
| Article | 131 |
| Review | 115 |
| Case report | 30 |
| Systematic review / meta-analysis | 20 |
| Editorial | 18 |
| Book chapter | 10 |
| Letter | 10 |
| Conference paper | 4 |
| Correction | 2 |
| Retraction notice | 1 |
| Book | 1 |
| Note | 1 |
| Retracted | 1 |

Database type labels differ (Scopus labels most systematic reviews as "Review"; PubMed adds "Systematic Review"/"Meta-Analysis" tags only to a subset), so the systematic-review count here understates the true number.

**Citation flags.** The 2021 Heliyon paper "Bracing NK cell based therapy to relegate pulmonary inflammation in COVID-19" (doi:10.1016/j.heliyon.2021.e07635) has a 2026 retraction notice; both are flagged `citable = NO` in the master file, as are the two corrections and the book preface. The manuscript skill excludes these from self-citation.

## 6. Authorship role

| Role | Works |
|---|---|
| Co-author | 162 |
| First author | 87 |
| Co-author (consortium paper) | 47 |
| Last author | 43 |
| Group/consortium collaborator | 5 |

GBD consortium papers: 35.

## 7. Citations (as reported in each export)

| Database | Total citations | h-index (from export) | Most-cited work |
|---|---|---|---|
| Scopus | 24,545 | 38 | Global incidence, prevalence, years lived with disability (YLDs), disa… (5,267) |
| Web of Science | 19,539 | 37 | Global incidence, prevalence, years lived with disability (YLDs), disa… (4,660) |

PubMed exports do not carry citation counts. Citation totals include the large GBD consortium papers; they differ from Google Scholar, which indexes more sources.

## 8. Top journals

| Journal | Works |
|---|---|
| Global Spine Journal | 40 |
| Journal of Orthopaedic Case Reports | 30 |
| Indian Journal of Orthopaedics | 24 |
| World Journal of Orthopedics | 21 |
| European Spine Journal | 10 |
| The Lancet | 9 |
| Journal of Clinical Orthopaedics and Trauma | 9 |
| World Journal of Methodology | 7 |
| Spine | 7 |
| World Journal of Stem Cells | 6 |
| World Journal of Experimental Medicine | 6 |
| Bioengineering | 5 |
| Extracellular Vesicles for Therapeutic and Diagnostic Applications | 5 |
| Stem Cell Investigation | 5 |
| The Lancet Public Health | 4 |
