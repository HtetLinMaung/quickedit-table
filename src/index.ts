export interface TextChangeData {
  rowIndex: number;
  cellIndex: number;
  newText: string;
  oldText: string;
  cell: HTMLTableCellElement;
  row: HTMLTableRowElement;
}

export interface initOptions {
  data?: Record<string, string>[];
  rowCallback?: (
    row: HTMLTableRowElement,
    rowData: Record<string, any>
  ) => void;
  cellCallback?: (
    cell: HTMLTableCellElement,
    cellData: any,
    rowData: Record<string, any>
  ) => void;
  selector: string;
  onTextChanged?: (data: TextChangeData) => Promise<void>;
}

export function initEditableTable(options: initOptions) {
  const { selector, onTextChanged, data, rowCallback, cellCallback } = options;

  let tds: NodeListOf<Element>;
  // Select all table cells
  if (data) {
    const table = arrayToTable({ data, selector, rowCallback, cellCallback });
    tds = table.querySelectorAll("td");
  } else {
    tds = document.querySelectorAll(`${selector} td`);
  }

  // For each table cell
  tds.forEach((td) => {
    // If the table cell is read-only, skip this cell
    if (td.classList.contains("readonly")) {
      return;
    }

    // Listen for a double click event
    td.addEventListener("dblclick", () => {
      // If the table cell already has an input, ignore this event
      if (td.querySelector("input")) {
        return;
      }

      // Get the text of the table cell
      let text = td.textContent || "";

      // Clear the table cell
      td.textContent = "";

      // Create a new input
      let input = document.createElement("input");

      // Set the input value to the text of the cell
      input.value = text;

      // Append the input to the table cell
      td.appendChild(input);

      // Focus the input and place the cursor at the end
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);

      // When the input loses focus, save the value and remove the input
      input.addEventListener("blur", () => {
        // Get the value of the input
        let newText = input.value;

        // Get the cell index and row index
        let cellIndex = (td as HTMLTableCellElement).cellIndex;
        let rowIndex = (td.parentNode as HTMLTableRowElement).rowIndex;

        // Remove the input
        td.removeChild(input);

        // Set the text of the table cell to the new value
        td.textContent = newText;

        // Call the onTextChanged callback
        if (onTextChanged) {
          onTextChanged({
            rowIndex,
            cellIndex,
            newText: text,
            oldText: text,
            cell: td as any,
            row: td.parentNode as any,
          });
        }
      });
    });
  });
  return {
    length: fetchTableData(selector).length,
    fetchTableData: () => fetchTableData(selector),
    getCellValue: (rowIndex: number, cellIndex: number) =>
      getCellValue(selector, rowIndex, cellIndex),
    updateTableCell: (rowIndex: number, cellIndex: number, newText: string) =>
      updateTableCell(selector, rowIndex, cellIndex, newText),
    updateLastRowCell: (cellIndex: number, newText: string) =>
      updateLastRowCell(selector, cellIndex, newText),
    addRowToTable: (cellValues: string[]) =>
      addRowToTable(selector, cellValues),
    updateRowInTable: (rowIndex: number, newCellValues: string[]) =>
      updateRowInTable(selector, rowIndex, newCellValues),
    deleteRowFromTable: (rowIndex: number) =>
      deleteRowFromTable(selector, rowIndex),
    forEach: (
      callback: (
        rowData: string[],
        rowIndex: number,
        row: HTMLTableRowElement
      ) => void
    ) => forEachRowInTable(selector, callback),
  };
}

// Function to fetch table data
export function fetchTableData(selector: string): Record<string, string>[] {
  let table = document.querySelector(selector);
  if (!table) throw new Error("Table not found");
  let headers = Array.from(table.querySelectorAll("th")).map(
    (th) => th.textContent
  );
  let rows = Array.from(table.querySelectorAll("tr")).slice(1); // Exclude the header row
  let data = rows.map((row) => {
    let cells = Array.from(row.querySelectorAll("td"));
    let obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header || ""] = cells[i]?.textContent || "";
    });
    return obj;
  });
  return data;
}

export interface TableOptions {
  selector?: string;
  data: Array<Record<string, any>>;
  rowCallback?: (
    row: HTMLTableRowElement,
    rowData: Record<string, any>
  ) => void;
  cellCallback?: (
    cell: HTMLTableCellElement,
    cellData: any,
    rowData: Record<string, any>
  ) => void;
}

export function arrayToTable(options: TableOptions): HTMLTableElement {
  const { data, rowCallback, cellCallback, selector } = options;

  let table: HTMLTableElement;
  if (selector) {
    table = document.querySelector(selector) as HTMLTableElement;
    if (!table) throw new Error("Table not found");
    table.innerHTML = "";
  } else {
    // Create a new table
    table = document.createElement("table");
  }

  // Create table header
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  if (data.length > 0) {
    for (let key in data[0]) {
      let th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  let tbody = document.createElement("tbody");
  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement("tr");

    // If a row callback is provided, call it with the current row and data
    if (rowCallback) {
      rowCallback(tr, data[i]);
    }

    for (let key in data[i]) {
      let td = document.createElement("td");
      td.textContent = data[i][key];

      // If a cell callback is provided, call it with the current cell and data
      if (cellCallback) {
        cellCallback(td, data[i][key], data[i]);
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  return table;
}

export function getCellValue(
  selector: string,
  rowIndex: number,
  cellIndex: number
): string | null {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if table, row, and cell exist
  if (
    table &&
    table.rows &&
    table.rows[rowIndex] &&
    table.rows[rowIndex].cells &&
    table.rows[rowIndex].cells[cellIndex]
  ) {
    // Return the cell text
    return table.rows[rowIndex].cells[cellIndex].textContent;
  } else {
    console.error("Cannot find table or cell.");
    return null;
  }
}

export function updateTableCell(
  selector: string,
  rowIndex: number,
  cellIndex: number,
  newText: string
) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if table, row, and cell exist
  if (
    table &&
    table.rows &&
    table.rows[rowIndex] &&
    table.rows[rowIndex].cells &&
    table.rows[rowIndex].cells[cellIndex]
  ) {
    // Update the cell text
    table.rows[rowIndex].cells[cellIndex].textContent = newText;
  } else {
    console.error("Cannot find table or cell to update.");
  }
}

export function updateLastRowCell(
  selector: string,
  cellIndex: number,
  newText: string
) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if the table exists and it has rows
  if (table && table.rows && table.rows.length > 0) {
    // Get the last row
    let lastRow = table.rows[table.rows.length - 1];

    // Check if the last row has cells and the specific cell exists
    if (lastRow.cells && lastRow.cells[cellIndex]) {
      // Update the cell text
      lastRow.cells[cellIndex].textContent = newText;
    } else {
      console.error("Cannot find cells in the last row to update.");
    }
  } else {
    console.error("Cannot find table or rows to update.");
  }
}

export function addRowToTable(selector: string, cellValues: string[]) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Create a new row at the end of the table
  let newRow = table.insertRow();

  // For each cell value
  cellValues.forEach((cellValue) => {
    // Create a new cell at the end of the row
    let newCell = newRow.insertCell();

    // Set the text of the cell
    newCell.textContent = cellValue;
  });
}

export function updateRowInTable(
  selector: string,
  rowIndex: number,
  newCellValues: string[]
) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if the table exists and it has rows
  if (table && table.rows && table.rows[rowIndex]) {
    // Get the row
    let row = table.rows[rowIndex];

    // For each new cell value
    newCellValues.forEach((cellValue, i) => {
      // Check if the cell exists
      if (row.cells && row.cells[i]) {
        // Set the text of the cell
        row.cells[i].textContent = cellValue;
      } else {
        console.error(`Cell at index ${i} does not exist.`);
      }
    });
  } else {
    console.error(`Row at index ${rowIndex} does not exist.`);
  }
}

export function deleteRowFromTable(selector: string, rowIndex: number) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if the table exists and it has rows
  if (table && table.rows && table.rows[rowIndex]) {
    // Delete the row
    table.deleteRow(rowIndex);
  } else {
    console.error(`Cannot find row at index ${rowIndex} to delete.`);
  }
}

export function forEachRowInTable(
  selector: string,
  callback: (
    rowData: string[],
    rowIndex: number,
    row: HTMLTableRowElement
  ) => void
) {
  // Get the table
  let table = document.querySelector(selector) as HTMLTableElement;

  // Check if the table exists and it has rows
  if (table && table.rows) {
    // Determine the number of header rows
    let headerRowCount = table.tHead ? table.tHead.rows.length : 0;

    // Iterate over each row starting from the first non-header row
    for (let i = headerRowCount; i < table.rows.length; i++) {
      // Get the cells for this row
      let cells = Array.from(table.rows[i].cells);

      // Map the cells to their text content
      let rowData = cells.map((cell) => cell.textContent || "");

      // Call the callback function with the row data and its index
      callback(rowData, i - headerRowCount, table.rows[i]);
    }
  } else {
    console.error(`Cannot find table or table has no rows.`);
  }
}

// function numberWithCommas(num: number | string): string {
//   let numFloat = typeof num === "number" ? num : parseFloat(num);
//   let numStr = numFloat.toFixed(2);
//   return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }
