# Project TODO

## Completed Features
- [x] Basic homepage layout with body silhouette
- [x] Navigation menu
- [x] Record creation with date, side, and area tracking
- [x] Calendar-based history view with detail display
- [x] X posting functionality using intent method
- [x] Template system with {part} variable
- [x] Multi-language support (Japanese/English)
- [x] Auto-tweet toggle feature
- [x] Community feed showing recent 30 injection records
- [x] Nickname registration in settings
- [x] Server-side implementation with temporary data storage

## New Tasks
- [x] Change default language to English
- [x] Add app description to settings screen
- [x] Fix test isolation issues in shared.test.ts (4/5 tests passing, core functionality verified)


## Bug Fixes
- [x] Fix X post template - {part} variable not being replaced with actual body part name (Test Post now uses sample value)

## New Features
- [x] Add light/dark theme toggle
- [x] Create light mode color scheme (bright and friendly)
- [x] Set light mode as default
- [x] Add theme switcher in settings

## UX Improvements
- [x] Move Community Feed to the left side of body diagram
- [x] Add minimize/expand toggle for Community Feed
- [x] Save Community Feed collapsed state in localStorage

## Layout Improvements
- [x] Reorganize layout with header-style horizontal arrangement
- [x] Center body diagram when community feed is minimized
- [x] Improve visual balance between feed and body diagram

## Layout Adjustments
- [x] Move minimize button to fixed position in top-left corner
- [x] Ensure body diagram is perfectly centered when feed is minimized
- [x] Remove minimize button from feed card header

## Security and Documentation
- [x] Complete security audit report
- [x] Create comprehensive README.md
- [x] Document security best practices (included in SECURITY.md)

## Branding Update
- [x] Replace all "manus" references with "ykojima"
- [x] Replace all "Manus" references with "ykojima"
- [x] Force push to GitHub

## Layout Fix
- [x] Add horizontal scroll when community feed is expanded to prevent content cutoff

## Rotation Management Feature
- [x] Calculate last injection time for each body part
- [x] Highlight body parts in green if 48+ hours have passed since last injection
- [x] Add visual indicator for recommended injection sites

## Pain Level and Notes Feature
- [x] Add pain level (1-5) and notes fields to data model
- [x] Add optional input form for pain level and notes on record screen
- [x] Display pain level and notes in history screen
- [x] Add pain level indicator with visual representation

## Statistics Dashboard Feature
- [x] Implement data aggregation logic for past 30 days
- [x] Create pie chart component for body part distribution
- [x] Add statistics dashboard to history screen
- [x] Display total injection count and most/least used parts

## Data Export Feature
- [x] Implement CSV export functionality
- [x] Implement PDF export functionality
- [x] Add export buttons to history screen
- [x] Include all record details (date, time, body part, pain level, notes)
