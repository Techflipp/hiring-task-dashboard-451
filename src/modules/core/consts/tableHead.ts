export type Order = 'asc' | 'desc';



export interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}


export const headCells: HeadCell[]= [
    { id: 'name', numeric: false, disablePadding: false, label: 'Camera Name' },
    { id: 'rtsp_url', numeric: false, disablePadding: false, label: 'rtsp_url' },
    { id: 'updated_at', numeric: false, disablePadding: false, label: 'Updated At' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'edit', numeric: false, disablePadding: false, label: 'Edit' },
];

export const demographicsHeadCells: HeadCell[] = [
    { id: 'count',numeric: true, disablePadding: false, label: 'Count' },
    { id: 'gender',numeric: true, disablePadding: false, label: 'Gender' },
    { id: 'age', numeric: true, disablePadding: false,label: 'Age' },
    { id: 'emotion', numeric: true, disablePadding: false,label: 'Emotion' },
    { id: 'ethnicity', numeric: true, disablePadding: false,label: 'Ethnicity' },
    { id: 'date', numeric: true, disablePadding: false,label: 'Date' },
];

// consts/tableHead.ts
export const distributionHeadCells = [
    { id: 'label',numeric: true, disablePadding: false, label: 'Label' },
    { id: 'count',numeric: true, disablePadding: false, label: 'Count' },
];
