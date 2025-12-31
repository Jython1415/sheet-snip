/**
 * Helpers.gs
 *
 * Contains utility functions used throughout the Sheet Snip add-on.
 * These functions provide common operations like metadata extraction,
 * cell reference generation, escaping, and validation.
 */

/**
 * Helper: Extract range metadata
 */
function getRangeMeta(range) {
  return {
    sheetName: range.getSheet().getName(),
    rangeNotation: range.getA1Notation(),
    startRow: range.getRow(),
    startCol: range.getColumn(),
    numRows: range.getNumRows(),
    numCols: range.getNumColumns(),
    totalCells: range.getNumRows() * range.getNumColumns(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Helper: Convert column number to letter (1=A, 27=AA)
 */
function columnToLetter(col) {
  let letter = '';
  while (col > 0) {
    const remainder = (col - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

/**
 * Helper: Get absolute A1 notation for a cell
 */
function getCellA1Notation(startRow, startCol, row, col) {
  const absoluteRow = startRow + row - 1;
  const absoluteCol = startCol + col - 1;
  return columnToLetter(absoluteCol) + absoluteRow;
}

/**
 * Helper: Get relative INDEX notation
 */
function getRelativeNotation(row, col) {
  return 'INDEX(' + row + ',' + col + ')';
}

/**
 * Helper: Get row header (first column value)
 */
function getRowHeader(values, row) {
  return values[row - 1] ? values[row - 1][0] : '';
}

/**
 * Helper: Get column header (first row value)
 */
function getColHeader(values, col) {
  return values[0] ? values[0][col - 1] : '';
}

/**
 * Helper: Calculate absolute row number
 */
function getAbsoluteRowNumber(startRow, relativeRow) {
  return startRow + relativeRow - 1;
}

/**
 * Helper: Calculate absolute column letter
 */
function getAbsoluteColumnLetter(startCol, relativeCol) {
  return columnToLetter(startCol + relativeCol - 1);
}

/**
 * Helper: Escape XML special characters
 */
function escapeXML(text) {
  if (typeof text !== 'string') {
    text = String(text);
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Helper: Escape Markdown special characters
 */
function escapeMarkdown(text) {
  if (typeof text !== 'string') {
    text = String(text);
  }
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

/**
 * Helper: Check if cell is empty
 */
function isEmptyCell(value) {
  return value === null || value === undefined || value === '';
}
