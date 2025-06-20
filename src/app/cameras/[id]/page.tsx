'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useCamera } from '@/hooks/useApi';
import { FormSkeleton } from '@/components/Layout/LoadingSkeleton';

interface CameraDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CameraDetailPage: React.FC<CameraDetailPageProps> = ({ params }) => {
  const [cameraId, setCameraId] = useState<string>('');
  const [isLoadingParams, setIsLoadingParams] = useState(true);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setCameraId(resolvedParams.id);
        if (isLoadingParams) {
          setIsLoadingParams(false);
        }
      } catch (error) {
        console.error('Failed to load params:', error);
      }
    };
    loadParams();
  }, [params, isLoadingParams]);

  const { data: camera, isLoading, error } = useCamera(cameraId);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load camera details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <FormSkeleton />
      </Container>
    );
  }

  if (!camera) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Camera not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Cameras
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {camera.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Camera ID: {camera.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href={`/cameras/${camera.id}/edit`}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Camera
            </Button>
            {camera.demographics_config && (
              <Button
                component={Link}
                href={`/cameras/${camera.id}/demographics`}
                variant="outlined"
                startIcon={<AnalyticsIcon />}
              >
                View Analytics
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  RTSP URL
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {camera.rtsp_url}
                </Typography>
              </Box>

              {camera.tags && camera.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {camera.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stream Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stream Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Resolution
                      </TableCell>
                      <TableCell>
                        {camera.stream_frame_width && camera.stream_frame_height
                          ? `${camera.stream_frame_width} × ${camera.stream_frame_height}`
                          : 'Not configured'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        FPS
                      </TableCell>
                      <TableCell>
                        {camera.stream_fps || 'Not configured'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Quality
                      </TableCell>
                      <TableCell>
                        {camera.stream_quality ? `${camera.stream_quality}%` : 'Not configured'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Max Length
                      </TableCell>
                      <TableCell>
                        {camera.stream_max_length ? `${camera.stream_max_length}s` : 'Not configured'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Skip Frames
                      </TableCell>
                      <TableCell>
                        {camera.stream_skip_frames || 'Not configured'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics Configuration */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Demographics Configuration
                </Typography>
                <Button
                  component={Link}
                  href={`/cameras/${camera.id}/demographics/config`}
                  variant="outlined"
                  size="small"
                  startIcon={<SettingsIcon />}
                >
                  {camera.demographics_config ? 'Edit Config' : 'Create Config'}
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {camera.demographics_config ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Track History Max Length
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.track_history_max_length || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Exit Threshold
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.exit_threshold || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Min Track Duration
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.min_track_duration || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Detection Confidence Threshold
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.detection_confidence_threshold || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Demographics Confidence Threshold
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.demographics_confidence_threshold || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Min Track Updates
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.min_track_updates || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Box Area Threshold
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.box_area_threshold || 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Save Interval
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.save_interval ? `${camera.demographics_config.save_interval}s` : 'Default'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                          Frame Skip Interval
                        </TableCell>
                        <TableCell>
                          {camera.demographics_config.frame_skip_interval || 'Default'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No demographics configuration found. Create one to start collecting analytics data.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CameraDetailPage; 