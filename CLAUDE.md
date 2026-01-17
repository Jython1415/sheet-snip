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

When testing new features before rolling them out to users:

1. **Create a feature branch** (recommended naming: `feature/description`)
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes locally** in the `src/` directory

3. **Test locally before merging**
   ```bash
   # Push changes to your Apps Script project (updates dev deployment)
   clasp push

   # Test the add-on in a Google Sheet
   # Open a Sheet and verify the feature works as expected
   ```

4. **Once verified, merge to main**
   ```bash
   git push origin feature/my-feature
   # Create PR and merge to main
   # GitHub Actions will automatically deploy to production
   ```

**Note:** The current workflow deploys directly to production on every push to `main`. Testing on feature branches with `clasp push` allows you to validate changes before they go live to all users.

## Development Commands

```bash
# Push changes manually
clasp push

# Open in Apps Script editor
clasp open

# Check deployment status
gh run list --workflow=deploy.yml
```
