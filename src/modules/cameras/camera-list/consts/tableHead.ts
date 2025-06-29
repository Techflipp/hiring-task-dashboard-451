import {HeadCell} from "@/modules/core/consts/tableHead";

export const headCells: HeadCell[]= [
    { id: 'name', numeric: false, disablePadding: false, label: 'Camera Name' },
    { id: 'rtsp_url', numeric: false, disablePadding: false, label: 'rtsp_url' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'edit', numeric: false, disablePadding: false, label: 'Edit' },
];
