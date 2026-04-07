## ADDED Requirements

### Requirement: Keyword search matches summary and tags

The search function SHALL compare the user's input against the `summary` field (column H) and `tags` field (column I) of each Idea record. A record matches if all keywords appear in either the summary or tags (case-insensitive). Matching SHALL be performed on the concatenation of summary and tags for each record.

#### Scenario: Single keyword match

- **WHEN** the user enters a single keyword "咖啡"
- **THEN** the results SHALL include all records where "咖啡" appears in either the summary or tags (case-insensitive)

#### Scenario: Multiple keyword AND logic

- **WHEN** the user enters "咖啡 環保"
- **THEN** the results SHALL include only records where both "咖啡" AND "環保" appear in the combined summary and tags text

#### Scenario: No matching results

- **WHEN** the user enters a keyword that does not match any record
- **THEN** the UI SHALL display a message indicating no results were found

#### Scenario: Empty search input

- **WHEN** the search input is empty
- **THEN** no results SHALL be displayed (the UI shows the default empty state)

### Requirement: Results sorted by date descending

Search results SHALL be sorted by the `date` field (column A, yyyy-MM-dd format) in descending order, with the most recent records appearing first.

#### Scenario: Results ordering

- **WHEN** search results contain records with dates 2024-01-15, 2024-03-20, and 2024-02-10
- **THEN** the results SHALL be displayed in order: 2024-03-20, 2024-02-10, 2024-01-15

### Requirement: Result display fields

Each search result card SHALL display the following fields: Idea summary (`summary`), tags (`tags`), author (`author`), collection date (`date`), and reference URL (`url`). The reference URL SHALL be rendered as a clickable hyperlink that opens in a new tab.

#### Scenario: Result card content

- **WHEN** a search result is displayed
- **THEN** the card SHALL show the summary, tags, author, date, and a clickable URL link

#### Scenario: Missing reference URL

- **WHEN** a record has an empty `url` field
- **THEN** the card SHALL omit the URL link instead of showing a broken or empty link
