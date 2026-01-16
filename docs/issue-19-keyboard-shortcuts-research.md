# Issue #19 Research: Keyboard Shortcuts for Sheet Snip

**Issue:** [Can we add hotkeys instead of having to click through the interface?](https://github.com/Jython1415/sheet-snip/issues/19)

**Research Date:** January 16, 2026

**Status:** Research Complete

---

## Executive Summary

**The Request:** Users want keyboard shortcuts to bypass menu navigation (steps 2-3) or consolidate the entire export process into a single action.

**Key Finding:** Google Apps Script **does not support global keyboard shortcuts** for add-ons. This is a hard architectural limitation, not a workaround opportunity. Macros (which support keyboard shortcuts) cannot be distributed with add-ons.

**Current State:** Sheet Snip already implements excellent keyboard accessibility within the sidebar dialog (PR #18), with Enter, Ctrl+C, and Escape shortcuts.

**Recommendation:** Implement workflow optimizations within Apps Script constraints (detailed below) and document workarounds for advanced users.

---

## Research Findings

### 1. Apps Script Keyboard Shortcut Capabilities

#### Native Support: NO

Google Apps Script **does not support custom keyboard shortcuts** (hotkeys) for add-ons distributed through the Google Sheets add-on store. This is a documented limitation:

- **Macros cannot be distributed with add-ons.** If you include a macro definition in an add-on's manifest, it is completely ignored by users of that add-on.
- **Keyboard shortcuts are restricted to bound scripts only** (scripts bound directly to a single Google Sheet), not to add-ons.

#### Macro Limitations

Macros are the **only** feature in Google Apps Script that supports keyboard shortcuts, but they're severely limited:

- **Format:** Must be `Ctrl+Alt+Shift+Number` (where number is 0-9)
- **Maximum:** 10 macros with keyboard shortcuts per sheet
- **Scope:** Bound scripts only—cannot work in standalone scripts, web apps, add-ons, or libraries
- **Distribution:** Cannot be packaged with add-ons

**Manifest Example (Bound Scripts Only):**
```json
"sheets": {
  "macros": [
    {
      "name": "myMacro",
      "description": "My macro",
      "functionName": "myFunction",
      "defaultShortcut": "Ctrl+Alt+Shift+1"
    }
  ]
}
```

#### Recent Updates (2025-2026)

As of January 2026:
- **No new keyboard shortcut APIs** have been announced for add-ons
- Official documentation (last updated December 11, 2025) shows no changes to this limitation
- Google Workspace add-ons continue to rely on menu-based UI

**Official Documentation:**
- [Google Sheets Macros](https://developers.google.com/apps-script/guides/sheets/macros)
- [Sheets Macro Manifest Resource](https://developers.google.com/apps-script/manifest/sheets)
- [Extending Google Sheets with Add-ons](https://developers.google.com/workspace/add-ons/editors/sheets)

---

### 2. Dialog/Sidebar Keyboard Interactions

#### What IS Possible

Keyboard events **can be captured** using standard JavaScript within Apps Script HTML dialogs and sidebars:

```javascript
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSubmit();
  }
  else if (event.key === 'Escape') {
    google.script.host.close();
  }
  else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    // Handle Ctrl+C or Cmd+C
  }
});
```

#### Current Implementation (PR #18)

Sheet Snip **already implements excellent keyboard accessibility** in `ClipboardDialog.html`:

✅ **Auto-focus on primary button** (lines 199-200)
```javascript
window.onload = function() {
  document.getElementById('copyButton').focus();
};
```

✅ **Keyboard shortcuts** (lines 203-216):
- `Enter` → Copy to clipboard
- `Ctrl+C` / `Cmd+C` → Copy to clipboard
- `Esc` → Close sidebar

✅ **Clear keyboard hint displayed** (lines 134-138):
```html
<div class="keyboard-hint">
  Press <kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy
</div>
```

✅ **Proper focus management and tab order**

#### Best Practices Implemented

Sheet Snip follows WCAG accessibility guidelines:
- Focus management on open (autofocus on primary action)
- Escape key support to close dialogs
- Visual focus indicators (2px outline)
- Keyboard operability for all interactive elements

#### Critical Limitation

**Sidebars cannot define global keyboard shortcuts** that work while focus is in the spreadsheet:

- **Modal Dialogs** (`showModalDialog`): Block sheet interaction entirely
- **Modeless Dialogs** (`showModelessDialog`): Allow sheet interaction but don't capture keyboard events from the sheet
- **Sidebars** (`showSidebar`): Allow sheet interaction, but keyboard shortcuts only work when sidebar has focus

The Apps Script documentation confirms that custom sidebars do not provide means for moving keyboard focus from the sheet without the user clicking the sidebar first.

---

### 3. Current Workflow Analysis

#### User Journey Breakdown

**Current workflow (with PR #18 keyboard shortcuts):**

| Step | Action | Type | Time/Count |
|------|--------|------|------------|
| 1 | Select data range | Manual | 1-3 seconds |
| 2 | Open "Extensions" menu | Click | 1 click |
| 3 | Select "Sheet Snip" | Click | 1 click |
| 4 | Choose export format | Click | 1 click |
| 5 | Wait for sidebar to render | Wait | 1-2 seconds |
| 6 | Copy to clipboard | Keyboard | Enter/Ctrl+C |
| 7 | Wait for auto-close | Wait | 1.5 seconds |
| **TOTAL** | | | **3 clicks + 2.5-3.5s latency** |

#### What is "Wait for the Side Panel"?

This refers to the sidebar created in `Dialog.gs` line 20:
```javascript
SpreadsheetApp.getUi().showSidebar(html);
```

The 1-2 second latency comes from:
- Apps Script server processing the export
- HTML template generation
- Sidebar rendering in the Google Sheets UI

This latency is **inherent to Apps Script** and cannot be eliminated.

#### Why Can't We Skip Steps 2-4?

**Apps Script limitations:**
1. No global keyboard shortcut API for add-ons
2. Custom menu items cannot have keyboard shortcuts
3. Dialogs/sidebars can't be triggered by keyboard while focus is in the sheet

---

### 4. Workaround Options

#### A. User-Created Macros (Advanced Users Only)

**Can users create macros that call add-on functions?**

**Short Answer: Not practically.**

While theoretically possible, this approach is **not practical** for average users:

**Process (if users were to attempt this):**
1. Open Apps Script editor for their sheet (Extensions > Apps Script)
2. Write code to call the add-on's functions
3. Create a macro definition in `appsscript.json`
4. Assign keyboard shortcut (Ctrl+Alt+Shift+Number)

**Why this isn't practical:**
- No GUI method—users must write code manually
- Users must know the add-on's function names
- Requires understanding of `google.script.run` syntax
- Defeats the "no code required" promise of add-ons
- Macros are sheet-specific and don't transfer between files

**Finding:** No major Google Sheets add-ons document this workaround in their official documentation, suggesting it's not a viable user-facing solution.

#### B. Browser Extensions

**Available Extensions:**

Several browser extensions can add custom keyboard shortcuts to Google Sheets:

| Extension | Platform | Rating | Features |
|-----------|----------|--------|----------|
| **SheetWhiz** | Chrome | 4.9★ | Excel shortcuts, trace precedents/dependents, Goal Seek |
| **ShortieCuts** | Chrome | 4.8★ | ALT-key shortcuts, trace formulas, TTS macro |
| **SheetKeys** | Chrome, Firefox | 4.9★ | Vim-style keyboard shortcuts, customizable |

**How they work:**
- Content scripts monitor keyboard events on Google Sheets pages
- Traverse DOM to locate UI elements
- Simulate clicks using `dispatchEvent(new MouseEvent('click'))`
- Can trigger menu items programmatically

**Limitations:**
- ❌ Browser-specific (only work where extension is installed)
- ❌ Can't package with add-ons (users must install separately)
- ❌ DOM structure fragility (may break when Google updates UI)
- ❌ Can't directly invoke add-on server-side functions
- ❌ No mobile support (iOS/Android don't support extensions)
- ❌ May be blocked by Google Workspace admins

**Security/Privacy:**
- Extensions can theoretically capture all keystrokes
- Only install from official Chrome Web Store or Firefox Add-ons
- Check developer reputation and privacy policies
- ShortieCuts explicitly states data runs locally

**Pricing Examples:**
- **SheetWhiz:** Used by OpenAI, Anthropic, DoorDash teams
- **ShortieCuts:** Free trial (14 days), then $7.99/month, $69.99/year, or $299.99 lifetime
- **SheetKeys:** Free and open-source

**Recommendation for Documentation:**
Could include a "Power User Tips" section mentioning these extensions as optional enhancements, but emphasize they're third-party tools not affiliated with Sheet Snip.

#### C. Apps Script Custom Functions

**Alternative approach:** Provide custom spreadsheet functions

**Example:**
```javascript
/**
 * Export selected range as Markdown
 * @customfunction
 */
function SHEET_SNIP_EXPORT() {
  // Export logic
}
```

**Limitations:**
- Functions run in cells, not as global shortcuts
- Can't access current selection (must pass range as parameter)
- Results appear in cells, not clipboard
- Not suitable for Sheet Snip's use case

---

### 5. Workflow Optimization Opportunities

While global keyboard shortcuts aren't possible, these improvements **can** streamline the workflow within Apps Script constraints:

#### A. Quick Export (Last Format) - HIGH PRIORITY

**Problem:** Repeat users navigate menus 4 times for same format

**Solution:** Add 5th menu item "Quick Export (Last Format)" using `PropertiesService`

**Implementation:**
```javascript
function quickExport() {
  const lastFormat = PropertiesService.getUserProperties().getProperty('lastFormat');
  if (lastFormat === 'rowBased') {
    exportRowBasedMarkdown();
  } else if (lastFormat === 'columnBased') {
    exportColumnBasedMarkdown();
  } // etc.
}
```

**Benefit:** Reduces 1 click for power users (3 clicks → 2 clicks)

**Effort:** Low (1-2 hours implementation)

**Code location:** `Menu.gs` and `ExportFunctions.gs`

---

#### B. One-Button Copy & Close - MEDIUM PRIORITY

**Problem:** After copying, users wait 1.5 seconds for auto-close

**Current behavior:** Shows success message, then auto-closes after 1.5s (lines 187-189)

**Improvement options:**
1. **Instant close** after successful copy (0s wait)
2. **User preference** via PropertiesService (instant vs. delayed)
3. **Success toast** instead of inline message (less disruptive)

**Benefit:** Saves 1.5 seconds per export

**Effort:** Low (1 hour implementation)

**Code location:** `ClipboardDialog.html` lines 182-190

---

#### C. Format Auto-Detection - MEDIUM PRIORITY

**Problem:** Users must decide between row-based or column-based export

**Solution:** Analyze selection dimensions and recommend format

**Logic:**
```javascript
function detectFormat(range) {
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();

  if (numCols > numRows) {
    return 'columnBased'; // Wide selection → column export
  } else {
    return 'rowBased'; // Tall selection → row export
  }
}
```

**Enhanced detection:**
- Check for header row patterns (bold, different background)
- Check for header column patterns
- Detect common data layouts (key-value pairs, tables, lists)

**Benefit:** Reduces decision time for new users (5-10 seconds saved)

**Effort:** Medium (4-6 hours for smart detection logic)

**Code location:** New `AutoDetect.gs` helper

---

#### D. Format Selector in Sidebar - MEDIUM PRIORITY

**Problem:** If user wants different format, must close sidebar and re-navigate menu

**Solution:** Add dropdown in sidebar to re-export in different format

**Implementation:**
```html
<select id="formatSelector" onchange="changeFormat()">
  <option value="rowBased">Row-Based Markdown</option>
  <option value="columnBased">Column-Based Markdown</option>
  <option value="formulasXML">Formulas XML</option>
  <option value="generalXML">General XML</option>
</select>
```

**Benefit:** Quick format switching without menu navigation (saves 2 clicks)

**Effort:** Medium (3-4 hours implementation)

**Code location:** `ClipboardDialog.html` and new server-side callback

---

#### E. Persistent Sidebar Mode - LOW PRIORITY

**Problem:** Users must reopen sidebar for each export

**Solution:** Add "Keep sidebar open" toggle

**Current:** Sidebar auto-closes after copy (line 187-189)

**Improvement:** User preference to keep sidebar open after copy

**Benefit:** Multi-export workflows become faster (saves 3 clicks per subsequent export)

**Effort:** Low (2 hours implementation)

**Trade-off:** Sidebar takes up screen real estate when not in use

---

### 6. UX Best Practices from Successful Add-ons

Research into top-performing Google Sheets add-ons reveals these patterns:

#### Paradigm Shift

The most successful add-ons have shifted from:

**Old model:** Global shortcuts → Fast execution

**New model:** Persistent sidebars + one-click operations → Fast *and* discoverable execution

This approach provides **better UX** because:
- ✅ No memorization required (no hotkey combos to learn)
- ✅ Self-documenting (menu items are visible)
- ✅ Accessible to all users (including those with motor impairments)
- ✅ Faster onboarding (Google reports 60% success in first month)

#### Examples of Excellent Add-on UX

**Supermetrics** (16,000+ users including Shopify, L'Oreal, Dyson)
- Persistent sidebar with one-click data pulls from 90+ platforms
- Opens once per session, eliminates need for menu navigation

**Power Tools** (Top 10 add-on)
- One-click bulk operations (merge, split, deduplicate, reformat)
- Self-explanatory UI, minimal documentation needed

**Numerous.ai** (Best 2025 add-on)
- Natural language prompts ("Summarize column B", "Write formula")
- Reduces cognitive load more effectively than keyboard shortcuts

#### Performance Context (2025 Updates)

Google's 2025 Sheets improvements show the platform's performance targets:
- **20% faster** loading for files over 200,000 rows
- **50% faster** paste operations
- **30% faster** spreadsheet loading for existing data
- **43% improved** offline sync stability

**Insight:** Apps Script sidebar latency (1-2 seconds) is already competitive with Google's own performance improvements.

---

## Recommendations

### Short-Term (Within 1-2 Weeks)

1. **Implement Quick Export (Last Format)** - Highest impact for power users
2. **Add instant close option** after copy - Eliminates 1.5s wait
3. **Document keyboard shortcuts** more prominently in marketplace listing

### Medium-Term (Within 1-2 Months)

4. **Add format auto-detection** - Helps new users choose correct format
5. **Implement format selector in sidebar** - Enables quick format switching
6. **Create "Power User Tips" documentation** mentioning browser extensions as optional enhancements

### Long-Term (Future Consideration)

7. **Explore persistent sidebar mode** - For users who do frequent exports
8. **Monitor Apps Script updates** for any keyboard shortcut API additions
9. **Consider companion browser extension** if keyboard shortcuts become a critical user request

### User Communication

**In marketplace listing, add:**
```markdown
## Keyboard Shortcuts

While in the export preview sidebar:
- Press **Enter** or **Ctrl+C** / **Cmd+C** to copy to clipboard
- Press **Esc** to close the sidebar

Note: Google Sheets add-ons cannot implement global keyboard shortcuts
that work outside the sidebar. For power users wanting more keyboard
control, consider browser extensions like SheetWhiz or SheetKeys as
optional enhancements.
```

**In sidebar UI, enhance the keyboard hint:**
```html
<div class="keyboard-hint">
  <strong>Keyboard shortcuts:</strong><br>
  <kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy •
  <kbd>Esc</kbd> to close
</div>
```

---

## Conclusion

**The Issue #19 request for global keyboard shortcuts cannot be fully implemented** due to Google Apps Script architectural limitations. However:

1. **Sheet Snip already has excellent keyboard accessibility** within the sidebar (PR #18)
2. **Current workflow is competitive** (3 clicks + 2.5-3.5s latency) compared to industry standards
3. **Several optimization opportunities exist** within Apps Script constraints that can improve workflow efficiency
4. **User education** about existing keyboard shortcuts and optional browser extensions can address power user needs

**Recommended Response to Issue #19:**

```markdown
Thanks for the feature request! I've researched this extensively and here's what I found:

**TL;DR:** Google Apps Script doesn't support global keyboard shortcuts for add-ons,
but Sheet Snip already has keyboard shortcuts *within* the export sidebar (Enter,
Ctrl+C, Esc from PR #18). I'm working on workflow improvements to reduce clicks.

**What's possible now:**
- When the export sidebar appears, press Enter or Ctrl+C to copy (no mouse needed!)
- Press Esc to close
- These shortcuts work on both Mac (Cmd) and Windows/Linux (Ctrl)

**Why global shortcuts aren't available:**
Google Sheets add-ons can't implement keyboard shortcuts that work outside dialogs/
sidebars. This is a platform limitation (macros support shortcuts but can't be
distributed with add-ons).

**Workarounds for power users:**
- Browser extensions like SheetWhiz or SheetKeys add keyboard shortcuts to Google Sheets
- Create personal macros in your sheet that call Sheet Snip functions (requires coding)

**Coming soon:**
I'm implementing "Quick Export" (remembers your last format) to reduce from 3 clicks
to 2 clicks for repeat exports. Also exploring instant-close after copy to eliminate
the 1.5s wait time.

Would these improvements address your workflow needs?
```

---

## Sources

### Official Google Documentation
- [Google Sheets Macros](https://developers.google.com/apps-script/guides/sheets/macros)
- [Sheets Macro Manifest Resource](https://developers.google.com/apps-script/manifest/sheets)
- [Extending Google Sheets with Add-ons](https://developers.google.com/workspace/add-ons/editors/sheets)
- [UI Style Guide for Editor Add-ons](https://developers.google.com/workspace/add-ons/guides/editor-style)
- [Dialogs and Sidebars in Google Workspace Documents](https://developers.google.com/apps-script/guides/dialogs)
- [HTML Service: Communicate with Server Functions](https://developers.google.com/apps-script/guides/html/communication)

### Browser Extensions
- [SheetKeys - Chrome Web Store](https://chromewebstore.google.com/detail/sheetkeys/dnckajfoijllhbnfdhdklcfpckcbonhi)
- [SheetKeys - GitHub Repository](https://github.com/philc/sheetkeys)
- [ShortieCuts - Official Website](https://www.shortiecuts.com/)
- [SheetWhiz - Official Website](https://www.sheetwhiz.com/)

### UX Best Practices & Industry Examples
- [10 Best Add-Ons for Google Sheets in 2025 - Numerous.ai](https://numerous.ai/blog/best-add-ons-for-google-sheets)
- [UI Style Guide for Google Workspace Add-ons](https://developers.google.com/workspace/add-ons/guides/workspace-style)
- [Google Workspace Updates: Improvements to Everyday Actions in Google Sheets](https://workspaceupdates.googleblog.com/2025/02/improvements-to-everyday-google-sheets-actions.html)
- [Google Sheets Statistics 2025](https://sqmagazine.co.uk/google-sheets-statistics/)

### Accessibility Standards
- [Dialog (Modal) Pattern - W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Making Accessibility Visible Part 5: Keyboard Focus - AudioEye](https://www.audioeye.com/post/making-accessibility-visible-part-5-keyboard-focus-and-dialog-behavior/)
- [Dialog / Modal Accessibility Specification (WCAG 2.1 AA)](https://www.a11ychecks.com/a11ydemo/components/dialog-modal-accessibility.html)

---

**Research conducted by:** Claude (Sonnet 4.5)
**Date:** January 16, 2026
**Research methodology:** Web search, official documentation review, codebase analysis, browser extension evaluation
