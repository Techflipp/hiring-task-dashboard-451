import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material'
import { HeadCell } from '@/modules/core/consts/tableHead'

type EnhacedTableHeadProps = {
  rowCount: number
  headCells: HeadCell[]
  showCheckBox?: boolean
}


export function EnhancedTableHead({
  headCells,
  rowCount,
    showCheckBox=true,
}: EnhacedTableHeadProps) {
  return (
    <TableHead>
      <TableRow sx={{bgcolor:'#f7f7f7'}} >
        {showCheckBox && <TableCell padding="checkbox">
          <Checkbox
              color='primary'
              inputProps={{
                'aria-label': 'select all ',
              }}
          />
        </TableCell>}
        {headCells.map((headCell) => (
          <TableCell
              width={'fit-content'}
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ fontWeight: '600',fontSize:'16px'}}
          >
            {headCell.label}
          </TableCell>
        ))}
        {/*<TableCell padding="checkbox"></TableCell>*/}
      </TableRow>
    </TableHead>
  );
}