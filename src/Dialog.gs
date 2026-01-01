/**
 * Dialog.gs
 *
 * Handles the clipboard dialog functionality for displaying and copying
 * exported data. This dialog provides a user interface for reviewing the
 * export and copying it to the clipboard.
 */

/**
 * Shows a sidebar that displays data for copying to clipboard
 */
function showClipboardDialog(data, dataType) {
  const htmlTemplate = HtmlService.createTemplateFromFile('ClipboardDialog');
  htmlTemplate.exportData = data;
  htmlTemplate.dataType = dataType;

  const html = htmlTemplate.evaluate()
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
}
