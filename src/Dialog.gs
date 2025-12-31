/**
 * Dialog.gs
 *
 * Handles the clipboard dialog functionality for displaying and copying
 * exported data. This dialog provides a user interface for reviewing the
 * export and copying it to the clipboard.
 */

/**
 * Shows a dialog that displays data for copying to clipboard
 */
function showClipboardDialog(data, dataType) {
  const htmlTemplate = HtmlService.createTemplateFromFile('ClipboardDialog');
  htmlTemplate.exportData = data;
  htmlTemplate.dataType = dataType;

  const html = htmlTemplate.evaluate()
    .setWidth(500)
    .setHeight(400);

  SpreadsheetApp.getUi().showModalDialog(html, 'Export Data');
}
