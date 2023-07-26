interface TextChangeData {
    rowIndex: number;
    cellIndex: number;
    newText: string;
    oldText: string;
    cell: HTMLTableCellElement;
    row: HTMLTableRowElement;
}
interface initOptions {
    data?: Record<string, string>[];
    rowCallback?: (row: HTMLTableRowElement, rowData: Record<string, any>) => void;
    cellCallback?: (cell: HTMLTableCellElement, cellData: any, rowData: Record<string, any>) => void;
    selector: string;
    onTextChanged?: (data: TextChangeData) => Promise<void>;
}
declare function initEditableTable(options: initOptions): {
    length: number;
    fetchTableData: () => Record<string, string>[];
    getCellValue: (rowIndex: number, cellIndex: number) => string | null;
    updateTableCell: (rowIndex: number, cellIndex: number, newText: string) => void;
    updateLastRowCell: (cellIndex: number, newText: string) => void;
    addRowToTable: (cellValues: string[]) => void;
    updateRowInTable: (rowIndex: number, newCellValues: string[]) => void;
    deleteRowFromTable: (rowIndex: number) => void;
    forEach: (callback: (rowData: string[], rowIndex: number, row: HTMLTableRowElement) => void) => void;
};
declare function fetchTableData(selector: string): Record<string, string>[];
interface TableOptions {
    selector?: string;
    data: Array<Record<string, any>>;
    rowCallback?: (row: HTMLTableRowElement, rowData: Record<string, any>) => void;
    cellCallback?: (cell: HTMLTableCellElement, cellData: any, rowData: Record<string, any>) => void;
}
declare function arrayToTable(options: TableOptions): HTMLTableElement;
declare function getCellValue(selector: string, rowIndex: number, cellIndex: number): string | null;
declare function updateTableCell(selector: string, rowIndex: number, cellIndex: number, newText: string): void;
declare function updateLastRowCell(selector: string, cellIndex: number, newText: string): void;
declare function addRowToTable(selector: string, cellValues: string[]): void;
declare function updateRowInTable(selector: string, rowIndex: number, newCellValues: string[]): void;
declare function deleteRowFromTable(selector: string, rowIndex: number): void;
declare function forEachRowInTable(selector: string, callback: (rowData: string[], rowIndex: number, row: HTMLTableRowElement) => void): void;
declare function numberWithCommas(num: number | string): string;
