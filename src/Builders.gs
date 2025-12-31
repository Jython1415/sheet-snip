/**
 * Builders.gs
 *
 * Contains the builder functions that generate export data in different formats.
 * Each builder function takes a range object and returns formatted text ready
 * for display and copying to the clipboard.
 */

/**
 * Build row-based Markdown-KV format
 */
function buildRowBasedMarkdown(range) {
  const meta = getRangeMeta(range);
  const values = range.getValues();

  let output = '---\n';
  output += 'Sheet: ' + meta.sheetName + '\n';
  output += 'Range: ' + meta.rangeNotation + '\n';
  output += 'Selection: ' + meta.numRows + ' rows × ' + meta.numCols + ' columns (' + meta.totalCells + ' cells)\n';

  const headerValues = [];
  for (let col = 0; col < meta.numCols; col++) {
    headerValues.push(values[0][col]);
  }
  output += 'Headers: ' + headerValues.join(', ') + '\n';
  output += 'Export Type: Row-based (Markdown-KV)\n';
  output += 'Timestamp: ' + meta.timestamp + '\n';
  output += 'Note: First row treated as headers. Each subsequent row is a record.\n';
  output += '---\n\n';

  for (let row = 2; row <= meta.numRows; row++) {
    const absRowNum = getAbsoluteRowNumber(meta.startRow, row);
    const rowRange = 'A' + absRowNum + ':' + columnToLetter(meta.startCol + meta.numCols - 1) + absRowNum;
    const startRowRange = getCellA1Notation(meta.startRow, meta.startCol, row, 1);
    const endRowRange = getCellA1Notation(meta.startRow, meta.startCol, row, meta.numCols);
    const actualRange = startRowRange.match(/[A-Z]+/)[0] + absRowNum + ':' + endRowRange.match(/[A-Z]+/)[0] + absRowNum;

    output += '## Row ' + row + ' (Sheet Row ' + absRowNum + ') [' + actualRange + ']\n\n';

    for (let col = 1; col <= meta.numCols; col++) {
      const header = values[0][col - 1];
      const cellValue = values[row - 1][col - 1];
      const absRef = getCellA1Notation(meta.startRow, meta.startCol, row, col);
      const relRef = getRelativeNotation(row, col);

      const displayValue = isEmptyCell(cellValue) ? '' : cellValue;
      output += '**' + escapeMarkdown(String(header)) + '** [' + absRef + ', ' + relRef + ']: ' + escapeMarkdown(String(displayValue)) + '\n';
    }
    output += '\n';
  }

  return output;
}

/**
 * Build column-based Markdown-KV format
 */
function buildColumnBasedMarkdown(range) {
  const meta = getRangeMeta(range);
  const values = range.getValues();

  let output = '---\n';
  output += 'Sheet: ' + meta.sheetName + '\n';
  output += 'Range: ' + meta.rangeNotation + '\n';
  output += 'Selection: ' + meta.numRows + ' rows × ' + meta.numCols + ' columns (' + meta.totalCells + ' cells)\n';

  const headerValues = [];
  for (let row = 0; row < meta.numRows; row++) {
    headerValues.push(values[row][0]);
  }
  output += 'Headers: ' + headerValues.join(', ') + '\n';
  output += 'Export Type: Column-based (Markdown-KV)\n';
  output += 'Timestamp: ' + meta.timestamp + '\n';
  output += 'Note: First column treated as headers. Each subsequent column is a record.\n';
  output += '---\n\n';

  for (let col = 2; col <= meta.numCols; col++) {
    const absColLetter = getAbsoluteColumnLetter(meta.startCol, col);
    const headerValue = values[0][col - 1];
    const colStartRow = meta.startRow;
    const colEndRow = meta.startRow + meta.numRows - 1;
    const actualRange = absColLetter + colStartRow + ':' + absColLetter + colEndRow;

    output += '## Column ' + col + ' (Sheet Column ' + absColLetter + '): ' + escapeMarkdown(String(headerValue)) + ' [' + actualRange + ']\n\n';

    for (let row = 1; row <= meta.numRows; row++) {
      const header = values[row - 1][0];
      const cellValue = values[row - 1][col - 1];
      const absRef = getCellA1Notation(meta.startRow, meta.startCol, row, col);
      const relRef = getRelativeNotation(row, col);

      const displayValue = isEmptyCell(cellValue) ? '' : cellValue;
      output += '**' + escapeMarkdown(String(header)) + '** [' + absRef + ', ' + relRef + ']: ' + escapeMarkdown(String(displayValue)) + '\n';
    }
    output += '\n';
  }

  return output;
}

/**
 * Build formula XML format
 */
function buildFormulasXML(range) {
  const meta = getRangeMeta(range);
  const values = range.getValues();
  const formulas = range.getFormulas();

  let output = '<?xml version="1.0" encoding="UTF-8"?>\n';
  output += '<!--\n';
  output += 'Sheet: ' + meta.sheetName + '\n';
  output += 'Range: ' + meta.rangeNotation + '\n';
  output += 'Selection: ' + meta.numRows + ' rows × ' + meta.numCols + ' columns (' + meta.totalCells + ' cells)\n';

  let formulaCount = 0;
  for (let row = 0; row < meta.numRows; row++) {
    for (let col = 0; col < meta.numCols; col++) {
      if (!isEmptyCell(formulas[row][col])) {
        formulaCount++;
      }
    }
  }

  output += 'Formula Cells: ' + formulaCount + ' (' + (meta.totalCells - formulaCount) + ' empty/value-only cells excluded)\n';
  output += 'Export Type: Formula-only (XML)\n';
  output += 'Timestamp: ' + meta.timestamp + '\n';
  output += '\n';
  output += 'IMPORTANT: This export includes ONLY cells containing formulas.\n';
  output += 'Empty cells and cells with static values are excluded.\n';
  output += '-->\n\n';
  output += '<formulas>\n';

  for (let row = 1; row <= meta.numRows; row++) {
    for (let col = 1; col <= meta.numCols; col++) {
      const formula = formulas[row - 1][col - 1];
      if (!isEmptyCell(formula)) {
        const absRef = getCellA1Notation(meta.startRow, meta.startCol, row, col);
        const relRef = getRelativeNotation(row, col);
        const rowNum = row;
        const colNum = col;

        output += '  <cell abs="' + absRef + '" rel="' + relRef + '" row="' + rowNum + '" col="' + colNum + '">\n';
        output += '    <formula>' + escapeXML(formula) + '</formula>\n';

        const rowHeader = values[0] ? values[0][col - 1] : null;
        const colHeader = values[row - 1] ? values[row - 1][0] : null;

        if (!isEmptyCell(rowHeader) || !isEmptyCell(colHeader)) {
          output += '    <context>\n';
          if (!isEmptyCell(rowHeader)) {
            output += '      <rowHeader>' + escapeXML(String(rowHeader)) + '</rowHeader>\n';
          }
          if (!isEmptyCell(colHeader)) {
            output += '      <colHeader>' + escapeXML(String(colHeader)) + '</colHeader>\n';
          }
          output += '    </context>\n';
        }

        output += '  </cell>\n';
      }
    }
  }

  output += '</formulas>\n';
  return output;
}

/**
 * Build general XML format (values only)
 */
function buildGeneralXML(range) {
  const meta = getRangeMeta(range);
  const values = range.getValues();

  let nonEmptyCount = 0;
  for (let row = 0; row < meta.numRows; row++) {
    for (let col = 0; col < meta.numCols; col++) {
      if (!isEmptyCell(values[row][col])) {
        nonEmptyCount++;
      }
    }
  }

  let output = '<?xml version="1.0" encoding="UTF-8"?>\n';
  output += '<!--\n';
  output += 'Sheet: ' + meta.sheetName + '\n';
  output += 'Range: ' + meta.rangeNotation + '\n';
  output += 'Selection: ' + meta.numRows + ' rows × ' + meta.numCols + ' columns (' + meta.totalCells + ' cells)\n';
  output += 'Non-Empty Cells: ' + nonEmptyCount + ' (' + (meta.totalCells - nonEmptyCount) + ' empty cells excluded)\n';
  output += 'Export Type: General (XML, values only)\n';
  output += 'Timestamp: ' + meta.timestamp + '\n';
  output += '\n';
  output += 'IMPORTANT: This export includes cell VALUES only (formulas are evaluated).\n';
  output += 'Empty cells are excluded to optimize token usage.\n';
  output += '-->\n\n';
  output += '<data>\n';

  for (let row = 1; row <= meta.numRows; row++) {
    for (let col = 1; col <= meta.numCols; col++) {
      const cellValue = values[row - 1][col - 1];
      if (!isEmptyCell(cellValue)) {
        const absRef = getCellA1Notation(meta.startRow, meta.startCol, row, col);
        const relRef = getRelativeNotation(row, col);

        output += '  <cell abs="' + absRef + '" rel="' + relRef + '" row="' + row + '" col="' + col + '">\n';
        output += '    <value>' + escapeXML(String(cellValue)) + '</value>\n';
        output += '  </cell>\n';
      }
    }
  }

  output += '</data>\n';
  return output;
}
