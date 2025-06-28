
import {Button, TableCell } from '@mui/material';
import { headCells } from '@/modules/core/consts/tableHead';
import * as React from 'react';
import Link from 'next/link';
import {EnhancedTablePagination} from "@/modules/core/tables/EnhancedTablePagination";

interface Camera {
    id: string;
    name: string;
    rtsp_url: string;
    is_active: boolean;
    updated_at: string;
}

export const Table = ({
                          rows = [],
                          loading,
                          totalCount,
                          onChangePage,
                      }: {
    rows:[];
    loading: boolean;
    totalCount: number;
    onChangePage: (skip: number, size: number) => void;
}) => {
    return (
        <EnhancedTablePagination
            rows={rows}
            totalCount={totalCount}
            loading={loading}
            headCells={headCells}
            showCheckBox={false}
            onChangePage={onChangePage}
            renderRow={(row: Camera) => (
                <React.Fragment key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.rtsp_url}</TableCell>
                    <TableCell>{row.updated_at}</TableCell>
                    <TableCell>
                        <Link href={`/cameras/${row.id}`}>
              <span style={{ color: row.is_active ? 'green' : 'red' }}>
                {row.is_active ? '✅ Working' : '❌ Stopped'}
              </span>
                        </Link>
                    </TableCell>
                        <TableCell>
                            <Button variant="contained" color={"info"}> <Link href={`/cameras/${row.id}`}>
                                Edit
                            </Link>
                            </Button>


                    </TableCell>
                </React.Fragment>
            )}
        />
    );
};

