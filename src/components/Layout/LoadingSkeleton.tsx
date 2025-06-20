import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';

export const CameraCardSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </Box>
    </CardContent>
  </Card>
);

export const CameraGridSkeleton: React.FC = () => (
  <Grid container spacing={3}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
        <CameraCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export const CameraTableSkeleton: React.FC = () => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
          <TableCell><Skeleton variant="text" width={120} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={150} /></TableCell>
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export const ChartSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={300} />
    </CardContent>
  </Card>
);

export const CameraListSkeleton = () => (
  <Grid container spacing={3}>
    {Array.from({ length: 8 }).map((_, index) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Skeleton variant="rounded" width={60} height={24} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export const FormSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
); 