export function initEditableTable(options) {
    const { selector, onTextChanged, data, rowCallback, cellCallback } = options;
    let tds;
    if (data) {
        const table = arrayToTable({ data, selector, rowCallback, cellCallback });
        tds = table.querySelectorAll("td");
    }
    else {
        tds = document.querySelectorAll(`${selector} td`);
    }
    tds.forEach((td) => {
        if (td.classList.contains("readonly")) {
            return;
        }
        td.addEventListener("dblclick", () => {
            if (td.querySelector("input")) {
                return;
            }
            let text = td.textContent || "";
            td.textContent = "";
            let input = document.createElement("input");
            input.value = text;
            td.appendChild(input);
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
            input.addEventListener("blur", () => {
                let newText = input.value;
                let cellIndex = td.cellIndex;
                let rowIndex = td.parentNode.rowIndex;
                td.removeChild(input);
                td.textContent = newText;
                if (onTextChanged) {
                    onTextChanged({
                        rowIndex,
                        cellIndex,
                        newText: text,
                        oldText: text,
                        cell: td,
                        row: td.parentNode,
                    });
                }
            });
        });
    });
    return {
        length: fetchTableData(selector).length,
        fetchTableData: () => fetchTableData(selector),
        getCellValue: (rowIndex, cellIndex) => getCellValue(selector, rowIndex, cellIndex),
        updateTableCell: (rowIndex, cellIndex, newText) => updateTableCell(selector, rowIndex, cellIndex, newText),
        updateLastRowCell: (cellIndex, newText) => updateLastRowCell(selector, cellIndex, newText),
        addRowToTable: (cellValues) => addRowToTable(selector, cellValues),
        updateRowInTable: (rowIndex, newCellValues) => updateRowInTable(selector, rowIndex, newCellValues),
        deleteRowFromTable: (rowIndex) => deleteRowFromTable(selector, rowIndex),
        forEach: (callback) => forEachRowInTable(selector, callback),
    };
}
export function fetchTableData(selector) {
    let table = document.querySelector(selector);
    if (!table)
        throw new Error("Table not found");
    let headers = Array.from(table.querySelectorAll("th")).map((th) => th.textContent);
    let rows = Array.from(table.querySelectorAll("tr")).slice(1);
    let data = rows.map((row) => {
        let cells = Array.from(row.querySelectorAll("td"));
        let obj = {};
        headers.forEach((header, i) => {
            var _a;
            obj[header || ""] = ((_a = cells[i]) === null || _a === void 0 ? void 0 : _a.textContent) || "";
        });
        return obj;
    });
    return data;
}
export function arrayToTable(options) {
    const { data, rowCallback, cellCallback, selector } = options;
    let table;
    if (selector) {
        table = document.querySelector(selector);
        if (!table)
            throw new Error("Table not found");
        table.innerHTML = "";
    }
    else {
        table = document.createElement("table");
    }
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
    let tbody = document.createElement("tbody");
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("tr");
        if (rowCallback) {
            rowCallback(tr, data[i]);
        }
        for (let key in data[i]) {
            let td = document.createElement("td");
            td.textContent = data[i][key];
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
export function getCellValue(selector, rowIndex, cellIndex) {
    let table = document.querySelector(selector);
    if (table &&
        table.rows &&
        table.rows[rowIndex] &&
        table.rows[rowIndex].cells &&
        table.rows[rowIndex].cells[cellIndex]) {
        return table.rows[rowIndex].cells[cellIndex].textContent;
    }
    else {
        console.error("Cannot find table or cell.");
        return null;
    }
}
export function updateTableCell(selector, rowIndex, cellIndex, newText) {
    let table = document.querySelector(selector);
    if (table &&
        table.rows &&
        table.rows[rowIndex] &&
        table.rows[rowIndex].cells &&
        table.rows[rowIndex].cells[cellIndex]) {
        table.rows[rowIndex].cells[cellIndex].textContent = newText;
    }
    else {
        console.error("Cannot find table or cell to update.");
    }
}
export function updateLastRowCell(selector, cellIndex, newText) {
    let table = document.querySelector(selector);
    if (table && table.rows && table.rows.length > 0) {
        let lastRow = table.rows[table.rows.length - 1];
        if (lastRow.cells && lastRow.cells[cellIndex]) {
            lastRow.cells[cellIndex].textContent = newText;
        }
        else {
            console.error("Cannot find cells in the last row to update.");
        }
    }
    else {
        console.error("Cannot find table or rows to update.");
    }
}
export function addRowToTable(selector, cellValues) {
    let table = document.querySelector(selector);
    let newRow = table.insertRow();
    cellValues.forEach((cellValue) => {
        let newCell = newRow.insertCell();
        newCell.textContent = cellValue;
    });
}
export function updateRowInTable(selector, rowIndex, newCellValues) {
    let table = document.querySelector(selector);
    if (table && table.rows && table.rows[rowIndex]) {
        let row = table.rows[rowIndex];
        newCellValues.forEach((cellValue, i) => {
            if (row.cells && row.cells[i]) {
                row.cells[i].textContent = cellValue;
            }
            else {
                console.error(`Cell at index ${i} does not exist.`);
            }
        });
    }
    else {
        console.error(`Row at index ${rowIndex} does not exist.`);
    }
}
export function deleteRowFromTable(selector, rowIndex) {
    let table = document.querySelector(selector);
    if (table && table.rows && table.rows[rowIndex]) {
        table.deleteRow(rowIndex);
    }
    else {
        console.error(`Cannot find row at index ${rowIndex} to delete.`);
    }
}
export function forEachRowInTable(selector, callback) {
    let table = document.querySelector(selector);
    if (table && table.rows) {
        let headerRowCount = table.tHead ? table.tHead.rows.length : 0;
        for (let i = headerRowCount; i < table.rows.length; i++) {
            let cells = Array.from(table.rows[i].cells);
            let rowData = cells.map((cell) => cell.textContent || "");
            callback(rowData, i - headerRowCount, table.rows[i]);
        }
    }
    else {
        console.error(`Cannot find table or table has no rows.`);
    }
}
