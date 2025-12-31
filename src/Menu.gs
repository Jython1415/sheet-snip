/**
 * Menu.gs
 *
 * Handles menu creation and UI entry points for the Sheet Snip add-on.
 * This file contains the initialization functions that run when the add-on
 * is installed or when a spreadsheet is opened.
 */

/**
 * Runs when the add-on is installed
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Adds a custom menu to Google Sheets when the spreadsheet opens
 */
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createAddonMenu()
    .addItem('Export Rows (Markdown)', 'exportRowBasedMarkdown')
    .addItem('Export Columns (Markdown)', 'exportColumnBasedMarkdown')
    .addItem('Export Formulas (XML)', 'exportFormulasXML')
    .addItem('Export All Data (XML)', 'exportGeneralXML')
    .addToUi();
}
