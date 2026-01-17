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
- `exportRowBasedMarkdown()` - Export data as row-based Markdown-KV
- `exportColumnBasedMarkdown()` - Export data as column-based Markdown-KV
- `exportFormulasXML()` - Export formulas as XML
- `exportGeneralXML()` - Export all data as XML
- Helper functions for building export formats

### ClipboardDialog.html
Modal dialog that:
- Displays export preview in textarea
- Copies to clipboard (supports modern API + fallback)
- Auto-closes after successful copy

## Deployment Workflow

1. Local changes → `git push`
2. GitHub Actions → `clasp push`
3. Updates live in Apps Script

## Testing New Features

Before merging to `main`:
1. Create a feature branch and make your changes in `src/`
2. Run `clasp push` to deploy to your Apps Script project
3. Test the add-on in a Google Sheet
4. Once verified, create a PR and merge to `main`

**Note:** Merging to `main` triggers GitHub Actions to run `clasp push`, updating the Apps Script project.

## Development Commands

```bash
# Push changes manually
clasp push

# Open in Apps Script editor
clasp open

# Check deployment status
gh run list --workflow=deploy.yml
```
