## ADDED Requirements

### Requirement: Search input interface

The page SHALL display a search input field prominently at the top of the page. The input field SHALL have placeholder text indicating its purpose. The user SHALL be able to trigger a search by pressing Enter or clicking a search button.

#### Scenario: User triggers search via Enter key

- **WHEN** the user types a keyword in the search input and presses Enter
- **THEN** the search SHALL execute and display matching results

#### Scenario: User triggers search via button

- **WHEN** the user types a keyword and clicks the search button
- **THEN** the search SHALL execute and display matching results

### Requirement: Card-style result display

Search results SHALL be displayed as individual cards. Each card SHALL have a white background (`#ffffff`), a border color of `#e8e8e5`, and appropriate padding for readability.

#### Scenario: Results rendered as cards

- **WHEN** search results are available
- **THEN** each result SHALL be rendered as a separate card with white background and defined border styling

### Requirement: MUJI-style minimal design

The page SHALL use a warm white background (`#fafaf8`), the Geist font family loaded from Google Fonts, and a clean minimal layout consistent with MUJI design aesthetics. Visual noise SHALL be minimized — no unnecessary decorative elements.

#### Scenario: Page visual appearance

- **WHEN** the page loads
- **THEN** the background color SHALL be `#fafaf8`, text SHALL use the Geist font family, and the layout SHALL be clean and minimal

### Requirement: Responsive layout

The page layout SHALL adapt to screen widths from 375px (mobile) up to desktop sizes. On narrow screens, the layout SHALL stack vertically. On wider screens, the layout SHALL use appropriate maximum width to maintain readability.

#### Scenario: Mobile viewport

- **WHEN** the viewport width is 375px
- **THEN** the search input and result cards SHALL be fully visible and usable without horizontal scrolling

#### Scenario: Desktop viewport

- **WHEN** the viewport width is 1200px or wider
- **THEN** the content area SHALL be centered with a maximum width constraint for readability

### Requirement: Loading state

The UI SHALL display a loading indicator while data is being fetched from the GAS API. The search input SHALL be disabled during loading.

#### Scenario: Loading indicator visibility

- **WHEN** data is being fetched
- **THEN** a loading indicator SHALL be visible and the search input SHALL be disabled

#### Scenario: Loading complete

- **WHEN** data fetch completes
- **THEN** the loading indicator SHALL be hidden and the search input SHALL be enabled
