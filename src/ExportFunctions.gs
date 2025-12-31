/**
 * ExportFunctions.gs
 *
 * Contains the main export functions that are called from the menu.
 * These functions validate the user's selection, call the appropriate
 * builder functions, and display the results in a dialog.
 */

/**
 * Exports the selected range as row-based Markdown-KV format
 */
function exportRowBasedMarkdown() {
  const range = SpreadsheetApp.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Please select a range first.');
    return;
  }

  const data = buildRowBasedMarkdown(range);
  showClipboardDialog(data, 'Row-based Data');
}

/**
 * Exports the selected range as column-based Markdown-KV format
 */
function exportColumnBasedMarkdown() {
  const range = SpreadsheetApp.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Please select a range first.');
    return;
  }

  const data = buildColumnBasedMarkdown(range);
  showClipboardDialog(data, 'Column-based Data');
}

/**
 * Exports the selected range formulas as XML
 */
function exportFormulasXML() {
  const range = SpreadsheetApp.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Please select a range first.');
    return;
  }

  const data = buildFormulasXML(range);
  showClipboardDialog(data, 'Formulas (XML)');
}

/**
 * Exports the selected range values as general XML
 */
function exportGeneralXML() {
  const range = SpreadsheetApp.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Please select a range first.');
    return;
  }

  const data = buildGeneralXML(range);
  showClipboardDialog(data, 'All Data (XML)');
}
