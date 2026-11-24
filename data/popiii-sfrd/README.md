# Pop III SFRD datasets

This directory contains the Population III star formation rate density (SFRD) datasets used by the interactive figure in `pages/popiiisfrd.qmd`.

The CSV files are the authoritative source data. Each file includes metadata describing its origin and any processing applied.

## Updating the datasets

**Whenever you add, modify, or remove a CSV file**, regenerate the JavaScript data bundle by running the following command from the repository root:

```bash
python assets/popiii-sfrd/embed_popiii_sfrd_csv.py
```

This updates `assets/popiii-sfrd/models_data.js`, which is used by the interactive plot.

The script does not modify the original CSV files.

**Important:** Commit the updated `models_data.js` together with any CSV changes. Otherwise, the interactive figure may display outdated data.

If you add a new theoretical model, you must also register it in `assets/popiii-sfrd/plot.js` and add its reference and description to the page.

## Data format

The first three columns of each CSV contain:

1. Redshift
2. Pop III SFRD [M☉ yr⁻¹ cMpc⁻³]
3. log₁₀(Pop III SFRD)

Additional columns and metadata are specific to each dataset and should be preserved.