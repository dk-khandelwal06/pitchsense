# Data Licensing & Attribution

## Data Source
All ball-by-ball cricket match data used in PitchSense is sourced from **Cricsheet** (https://cricsheet.org).

- **Dataset Source:** Cricsheet IPL JSON Archive (`ipl_json.zip`)
- **Official URL:** https://cricsheet.org/downloads/
- **License Terms:** https://cricsheet.org/licensing/

## Open Data Commons Attribution License (ODC-By v1.0)
The Cricsheet data used by this application is licensed under the Open Data Commons Attribution License (ODC-By) v1.0.

Under this license, you are free to:
- **Share:** Copy, distribute, and use the database.
- **Create:** Produce works from the database.
- **Adapt:** Modify, transform, and build upon the database.

As long as you attribute the work to Cricsheet:
> "Data courtesy of Cricsheet (https://cricsheet.org), made available under the Open Data Commons Attribution License."

## Exclusion & Quality Rules
1. **DLS Exclusion:** 23 Duckworth-Lewis-Stern rain-affected matches were excluded to preserve consistent 20-over physical invariants.
2. **Super-Over/Ties:** 25 tied/no-result matches were excluded from binary logistic regression label generation.
3. **Completed Fixtures:** 1,195 verified IPL fixtures spanning 2008 through 2024 were ingested into 138,683 delivery records.

