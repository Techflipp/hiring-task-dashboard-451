import React from 'react'
import { Box } from '@mui/material'

export const Page = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <Box pt={4} px={3} sx={{
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      gap: '24px',
      //pt: 4
    }} component='section'>
      {children}
    </Box>
  )
}
