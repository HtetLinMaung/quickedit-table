# QuickEdit Table

## Description

QuickEdit Table is an easy-to-use, efficient and fast package for creating and manipulating editable tables in the web. This library provides an abstraction for creating tables, editing cell data on double-click, and triggering events on data change. It also offers a host of utility functions to work with the created table.

## Installation

Using npm:

```bash
npm install quickedit-table
```

## Usage

You can import the package and use its API to create editable tables:

```javascript
import { initEditableTable } from "quickedit-table";

// Create the editable table
let editableTable = initEditableTable({
  selector: "#myTable",
  data: [
    { name: "John", age: "30" },
    { name: "Jane", age: "28" },
  ],
  onTextChanged: async ({
    rowIndex,
    cellIndex,
    newText,
    oldText,
    cell,
    row,
  }) => {
    console.log(
      `Cell at row ${rowIndex} and index ${cellIndex} changed from "${oldText}" to "${newText}"`
    );
  },
});
```

`initEditableTable` function initializes the table with given options. The function returns an object with methods to manipulate the table data and structure:

- `fetchTableData()`: Fetch the current data in the table.
- `getCellValue(rowIndex, cellIndex)`: Get the value of the specified cell.
- `updateTableCell(rowIndex, cellIndex, newText)`: Update the specified cell with new text.
- `updateLastRowCell(cellIndex, newText)`: Update the last cell of the specified column.
- `addRowToTable(cellValues)`: Add a new row to the table.
- `updateRowInTable(rowIndex, newCellValues)`: Update a row with new values.
- `deleteRowFromTable(rowIndex)`: Delete a row from the table.
- `forEach(callback)`: Iterate over each row in the table.

## Contact

If you have any questions, feel free to open an issue or contact the package author.
