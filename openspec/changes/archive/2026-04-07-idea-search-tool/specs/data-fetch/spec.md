## ADDED Requirements

### Requirement: GAS Web App returns all Idea data

The Google Apps Script Web App SHALL expose a `doGet` endpoint that reads all rows from the `Sheet1` worksheet of the configured Google Sheets spreadsheet and returns them as a JSON array. Each element SHALL be an object with keys: `date`, `originalDate`, `content`, `url`, `author`, `collector`, `note`, `summary`, `tags`, `source`, mapped from columns A through J respectively. The first row (header row) SHALL be excluded from the response. Empty rows SHALL be excluded.

#### Scenario: Successful data fetch

- **WHEN** the frontend sends a GET request to the GAS Web App URL
- **THEN** the response SHALL be a JSON array containing all non-empty data rows from Sheet1, with each row mapped to an object using the defined key names

#### Scenario: Empty spreadsheet

- **WHEN** the spreadsheet contains only the header row and no data rows
- **THEN** the response SHALL be an empty JSON array `[]`

### Requirement: Frontend loads all data on page open

The frontend SHALL call the GAS Web App API when the page loads and store the returned data in memory. The data SHALL be available for search operations without additional API calls. During the loading period, the UI SHALL display a loading indicator.

#### Scenario: Page load triggers data fetch

- **WHEN** the user opens the page
- **THEN** the frontend SHALL immediately call the GAS Web App API and display a loading indicator until the data is fully loaded

#### Scenario: Data load completes successfully

- **WHEN** the GAS Web App returns data successfully
- **THEN** the loading indicator SHALL be hidden and the search input SHALL become active

#### Scenario: Data load fails

- **WHEN** the GAS Web App request fails (network error or timeout)
- **THEN** the UI SHALL display an error message indicating data could not be loaded, with an option to retry
