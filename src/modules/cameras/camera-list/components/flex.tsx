import {
  Box,
  SxProps
} from '@mui/material'

export const Flex = (props: SxProps & React.PropsWithChildren) => {
  const { children, ...rest } = props

  return (
    <Box
      sx={{
        display: 'flex',
        ...rest
      }}
    >
      {children}
    </Box>
  )
}
