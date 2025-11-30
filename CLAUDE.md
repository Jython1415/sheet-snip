# Development Context for Claude Code

## Project Structure

```
sheet-snip/
├── src/
│   ├── Code.gs              # Main Apps Script code
│   └── ClipboardDialog.html # UI dialog for clipboard copy
├── .github/
│   └── workflows/
│       └── deploy.yml       # Auto-deploy on push to main
├── .gitignore               # Excludes .clasprc.json (credentials)
├── .claspignore             # Excludes docs from Apps Script push
├── README.md                # Minimal dev setup instructions
├── LICENSE                  # MIT
└── CLAUDE.md                # This file
```

## Apps Script Files

### Code.gs
Main script with:
- `onOpen()` - Creates custom menu in Sheets
- `exportValuesJSON()` - Export cell values as JSON
- `exportFormulasJSON()` - Export formulas as JSON
- `exportBothJSON()` - Export both values and formulas
- Helper functions for building JSON structures

### ClipboardDialog.html
Modal dialog that:
- Displays JSON preview in textarea
- Copies to clipboard (supports modern API + fallback)
- Auto-closes after successful copy

## Deployment Workflow

1. Local changes → `git push`
2. GitHub Actions → `clasp push`
3. Updates live in Apps Script

## Development Commands

```bash
# Push changes manually
clasp push

# Open in Apps Script editor
clasp open

# Check deployment status
gh run list --workflow=deploy.yml
```

## Key Implementation Details

- All exports include metadata (sheet name, range, dimensions, timestamp, export type)
- JSON is formatted with 2-space indentation for readability
- Combined export puts values and formulas in separate top-level keys
- Dialog uses both modern clipboard API and execCommand fallback for compatibility

## Testing Status

✅ **Add-on is working!** Successfully tested with test deployment.

### Test Results
- Menu appears correctly in Extensions
- All three export types work (values, formulas, combined)
- Clipboard copy functionality works
- Handles empty cells correctly
- Handles formulas (including array formulas like UNPIVOT)

## Next Steps

### Immediate
1. Continue testing with different data scenarios
2. Consider cleaning up temp files: `temp.js`, `temp.html`, `sheet-snip-setup-plan.md`

### Future (See GitHub Issues)
- Issue #1: Privacy policy research
- Issue #2: Marketplace icon creation
- Issue #3: Public release preparation
