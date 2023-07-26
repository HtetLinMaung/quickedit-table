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
    rowCallback?: (row: HTMLTableRowElement, rowData: Record<string, any>) => void;
    cellCallback?: (cell: HTMLTableCellElement, cellData: any, rowData: Record<string, any>) => void;
    selector: string;
    onTextChanged?: (data: TextChangeData) => Promise<void>;
}
export declare function initEditableTable(options: initOptions): {
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
export declare function fetchTableData(selector: string): Record<string, string>[];
export interface TableOptions {
    selector?: string;
    data: Array<Record<string, any>>;
    rowCallback?: (row: HTMLTableRowElement, rowData: Record<string, any>) => void;
    cellCallback?: (cell: HTMLTableCellElement, cellData: any, rowData: Record<string, any>) => void;
}
export declare function arrayToTable(options: TableOptions): HTMLTableElement;
export declare function getCellValue(selector: string, rowIndex: number, cellIndex: number): string | null;
export declare function updateTableCell(selector: string, rowIndex: number, cellIndex: number, newText: string): void;
export declare function updateLastRowCell(selector: string, cellIndex: number, newText: string): void;
export declare function addRowToTable(selector: string, cellValues: string[]): void;
export declare function updateRowInTable(selector: string, rowIndex: number, newCellValues: string[]): void;
export declare function deleteRowFromTable(selector: string, rowIndex: number): void;
export declare function forEachRowInTable(selector: string, callback: (rowData: string[], rowIndex: number, row: HTMLTableRowElement) => void): void;
