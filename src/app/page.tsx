'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from '@mui/material';
import {
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCameras, useTags } from '@/hooks/useApi';
import { CameraGridSkeleton, CameraTableSkeleton } from '@/components/Layout/LoadingSkeleton';
import Grid from '@mui/material/Grid';

const CameraListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const { data: camerasData, isLoading, error } = useCameras({
    page,
    size: pageSize,
    camera_name: searchTerm || undefined,
  });

  const { data: tags } = useTags();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handlePageSizeChange = (event: any) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to first page when changing page size
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load cameras. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cameras
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor your camera systems
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search cameras"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 250 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={pageSize}
            label="Items per page"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newViewMode) => {
            if (newViewMode !== null) {
              setViewMode(newViewMode);
            }
          }}
          size="small"
        >
          <ToggleButton value="grid">
            <GridIcon />
          </ToggleButton>
          <ToggleButton value="table">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      {isLoading ? (
        viewMode === 'grid' ? <CameraGridSkeleton /> : <CameraTableSkeleton />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {camerasData?.items.map((camera) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={camera.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {camera.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {camera.rtsp_url}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        {camera.stream_frame_width && camera.stream_frame_height && (
                          <Typography variant="body2" color="text.secondary">
                            Resolution: {camera.stream_frame_width}×{camera.stream_frame_height}
                          </Typography>
                        )}
                        {camera.stream_fps && (
                          <Typography variant="body2" color="text.secondary">
                            FPS: {camera.stream_fps}
                          </Typography>
                        )}
                      </Box>

                      {camera.tags && camera.tags.length > 0 && (
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {camera.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}

                      <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                        <Button
                          component={Link}
                          href={`/cameras/${camera.id}`}
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          fullWidth
                        >
                          View Details
                        </Button>
                        <Button
                          component={Link}
                          href={`/cameras/${camera.id}/edit`}
                          variant="contained"
                          size="small"
                          startIcon={<EditIcon />}
                          fullWidth
                        >
                          Edit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>RTSP URL</TableCell>
                    <TableCell>Resolution</TableCell>
                    <TableCell>FPS</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {camerasData?.items.map((camera) => (
                    <TableRow key={camera.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{camera.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {camera.rtsp_url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {camera.stream_frame_width && camera.stream_frame_height
                          ? `${camera.stream_frame_width}×${camera.stream_frame_height}`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{camera.stream_fps || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {camera.tags?.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            component={Link}
                            href={`/cameras/${camera.id}`}
                            size="small"
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            component={Link}
                            href={`/cameras/${camera.id}/edit`}
                            size="small"
                            color="secondary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {camerasData && camerasData.pages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={camerasData.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Results info */}
          {camerasData && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, camerasData.total)} of {camerasData.total} cameras
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CameraListPage;
