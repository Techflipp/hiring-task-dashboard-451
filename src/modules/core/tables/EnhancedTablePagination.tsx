  import React from "react";
  import {TableCell, Skeleton, TableContainer, Table, TableRow, TableBody, Paper, TablePagination,} from "@mui/material";
  import { HeadCell } from "@/modules/core/consts/tableHead";
  import {EnhancedTableHead} from "@/modules/core/tables/EnhancedTableHead";

  export type EnhancedTablePaginationProps<T> = {
    rows: (T & { id?: string; label?: string[] })[];
    headCells: HeadCell[];
    loading: boolean;
    onChangePage(skip: number, take: number): void;
    renderRow?(row: T): React.ReactNode;
    totalCount: number;
    showCheckBox?: boolean;
    page?: number;
    rowsPerPage?: number;
    onChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };


  export function EnhancedTablePagination<T>({
    rows,
    renderRow,
    headCells,
    loading,
    onChangePage,
    totalCount,
    showCheckBox=false,


  }: EnhancedTablePaginationProps<T>) {
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);





    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
      let take = rowsPerPage;
      let skip = newPage * take;
      onChangePage(skip, take);
    };

    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;



    const getRows = () => {
      if (!rows?.length) {
        return [];
      }
      return [...rows]
    };

    const visibleRows = getRows();

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newTake = parseInt(event.target.value, 10);
      setRowsPerPage(newTake);
      setPage(0);
      onChangePage(0, newTake);
    };

    return (
      <Paper>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              headCells={headCells}
              rowCount={rows?.length || 0}
              showCheckBox={showCheckBox}
            />
            <TableBody>
              {loading ? (
                <TableRowsLoader columnsCount={headCells.length} />
              ) : (
                <>
                  {visibleRows?.map((row, index) => {
                    const key = row.id;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={key}
                        sx={{
                          cursor: "pointer",
                          height: "55px",
                          width: "fit-content",
                        }}
                      >

                        {renderRow && renderRow(row)}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 56,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
    );
  }

  export const TableRowsLoader = ({ rowsNum = 5, columnsCount = 5 }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        {[...Array(columnsCount)].map((_, i) => (
          <TableCell component="th" scope="row" key={String(i)}>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };
