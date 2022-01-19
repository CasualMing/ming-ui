/*
 * @Author: CasualMing
 * @Date: 2021-01-11 09:21:19
 * @LastEditTime: 2021-11-15 10:00:01
 * @Description: 提供与各种文件相关的处理方法
 */
import XLSX from 'xlsx';
import { blobToDownload } from './fileUtil';

// 将json导出为excel
export function export_json_to_excel(th: any, jsonData: any[], title: string) {
    let data = jsonData;
    data.unshift(th);
    let ws_name = "SheetJS";
    let wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    const colWidth = data.map(row => row.map(val => {
        if (val == null) {
            return { 'wch': 10 };
        }
        else if (val.toString().charCodeAt(0) > 255) {
            return { 'wch': val.toString().length * 2 };
        } else {
            return { 'wch': val.toString().length };
        }
    }))
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    let fileName = (title || 'excel-list') + ".xlsx";
    blobToDownload(blob, fileName);
    return Promise.resolve(fileName);
}

// 将表格导出为excel
export function export_table_to_excel(id: string, title: string) {
    let theTable = document.getElementById(id);
    let oo = generateArray(theTable);
    let ranges = oo[1];
    let data = oo[0];
    let ws_name = "SheetJS";
    let wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws['!merges'] = ranges;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    let fileName = (title || 'excel-list') + ".xlsx";
    blobToDownload(blob, fileName);
    return Promise.resolve(fileName);
}

function generateArray(table: any): any {
    let out: any = [];
    let rows = table.querySelectorAll('tr');
    let ranges: any = [];
    for (let R = 0; R < rows.length; ++R) {
        let outRow: any = [];
        let row = rows[R];
        let columns = row.querySelectorAll('td');
        for (let C = 0; C < columns.length; ++C) {
            let cell = columns[C];
            let colspan = cell.getAttribute('colspan');
            let rowspan = cell.getAttribute('rowspan');
            let cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 } });
            }
            outRow.push(cellValue !== "" ? cellValue : null);
            if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
}
function datenum(v: any, date1904?): number {
    if (date1904) v += 1462;
    let epoch = Date.parse(v);
    return (epoch - (new Date(Date.UTC(1899, 11, 30)) as any)) / (24 * 60 * 60 * 1000);
}
function sheet_from_array_of_arrays(data: any) {
    let ws = {};
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R != data.length; ++R) {
        for (let C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            let cell: any = { v: data[R][C] };
            if (cell.v == null) continue;
            let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = (XLSX.SSF as any)._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}
function Workbook(): void {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}
function s2ab(s: any): any {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
