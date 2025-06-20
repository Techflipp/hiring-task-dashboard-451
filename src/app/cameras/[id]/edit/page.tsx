'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCamera, useUpdateCamera, useTags } from '@/hooks/useApi';
import { CameraFormData, CameraFormErrors } from '@/types';
import { FormSkeleton } from '@/components/Layout/LoadingSkeleton';

interface CameraEditPageProps {
  params: Promise<{ id: string }>;
}

const CameraEditPage: React.FC<CameraEditPageProps> = ({ params }) => {
  const [cameraId, setCameraId] = useState<string>('');
  const [isLoadingParams, setIsLoadingParams] = useState(true);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const { id } = await params;
        setCameraId(id);
      } catch (error) {
        console.error('Failed to load params:', error);
      } finally {
        setIsLoadingParams(false);
      }
    };
    loadParams();
  }, [params]);

  const router = useRouter();
  const { data: camera, isLoading: isLoadingCamera, error: cameraError } = useCamera(cameraId);
  const { data: tags } = useTags();
  const updateCameraMutation = useUpdateCamera();

  const [formData, setFormData] = useState<CameraFormData>({
    name: '',
    rtsp_url: '',
    stream_frame_width: undefined,
    stream_frame_height: undefined,
    stream_max_length: undefined,
    stream_quality: undefined,
    stream_fps: undefined,
    stream_skip_frames: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<CameraFormErrors>({});

  // Initialize form data when camera data is loaded
  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        rtsp_url: camera.rtsp_url,
        stream_frame_width: camera.stream_frame_width,
        stream_frame_height: camera.stream_frame_height,
        stream_max_length: camera.stream_max_length,
        stream_quality: camera.stream_quality,
        stream_fps: camera.stream_fps,
        stream_skip_frames: camera.stream_skip_frames,
        tags: camera.tags?.map(tag => tag.id) || [],
      });
    }
  }, [camera]);

  const validateForm = (): boolean => {
    const newErrors: CameraFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.rtsp_url.trim()) {
      newErrors.rtsp_url = 'RTSP URL is required';
    } else if (!formData.rtsp_url.startsWith('rtsp://')) {
      newErrors.rtsp_url = 'RTSP URL must start with rtsp://';
    }

    if (formData.stream_frame_width && (formData.stream_frame_width < 1 || formData.stream_frame_width > 2560)) {
      newErrors.stream_frame_width = 'Width must be between 1 and 2560';
    }

    if (formData.stream_frame_height && (formData.stream_frame_height < 1 || formData.stream_frame_height > 2560)) {
      newErrors.stream_frame_height = 'Height must be between 1 and 2560';
    }

    if (formData.stream_max_length && (formData.stream_max_length < 0 || formData.stream_max_length > 10000)) {
      newErrors.stream_max_length = 'Max length must be between 0 and 10000';
    }

    if (formData.stream_quality && (formData.stream_quality < 80 || formData.stream_quality > 100)) {
      newErrors.stream_quality = 'Quality must be between 80 and 100';
    }

    if (formData.stream_fps && (formData.stream_fps < 1 || formData.stream_fps > 120)) {
      newErrors.stream_fps = 'FPS must be between 1 and 120';
    }

    if (formData.stream_skip_frames && (formData.stream_skip_frames < 0 || formData.stream_skip_frames > 100)) {
      newErrors.stream_skip_frames = 'Skip frames must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateCameraMutation.mutateAsync({
        id: cameraId,
        data: formData,
      });
      
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      console.error('Failed to update camera:', error);
    }
  };

  const handleInputChange = (field: keyof CameraFormData, value: string | number | string[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (isLoadingParams) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <FormSkeleton />
      </Container>
    );
  }

  if (cameraError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load camera details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (isLoadingCamera) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <FormSkeleton />
      </Container>
    );
  }

  if (!camera) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Camera not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          Cameras
        </MuiLink>
        <MuiLink component={Link} href={`/cameras/${camera.id}`} color="inherit">
          {camera.name}
        </MuiLink>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Camera
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update camera configuration and settings
        </Typography>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Camera Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="RTSP URL"
                  value={formData.rtsp_url}
                  onChange={(e) => handleInputChange('rtsp_url', e.target.value)}
                  error={!!errors.rtsp_url}
                  helperText={errors.rtsp_url}
                  required
                  placeholder="rtsp://example.com/stream"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tagId) => {
                          const tag = tags?.find(t => t.id === tagId);
                          return tag ? (
                            <Chip key={tagId} label={tag.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags?.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Stream Configuration */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Stream Configuration
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Frame Width"
                  type="number"
                  value={formData.stream_frame_width || ''}
                  onChange={(e) => handleInputChange('stream_frame_width', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_frame_width}
                  helperText={errors.stream_frame_width || '1-2560'}
                  inputProps={{ min: 1, max: 2560 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Frame Height"
                  type="number"
                  value={formData.stream_frame_height || ''}
                  onChange={(e) => handleInputChange('stream_frame_height', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_frame_height}
                  helperText={errors.stream_frame_height || '1-2560'}
                  inputProps={{ min: 1, max: 2560 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="FPS"
                  type="number"
                  value={formData.stream_fps || ''}
                  onChange={(e) => handleInputChange('stream_fps', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_fps}
                  helperText={errors.stream_fps || '1-120'}
                  inputProps={{ min: 1, max: 120 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Quality (%)"
                  type="number"
                  value={formData.stream_quality || ''}
                  onChange={(e) => handleInputChange('stream_quality', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_quality}
                  helperText={errors.stream_quality || '80-100'}
                  inputProps={{ min: 80, max: 100 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Max Length (seconds)"
                  type="number"
                  value={formData.stream_max_length || ''}
                  onChange={(e) => handleInputChange('stream_max_length', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_max_length}
                  helperText={errors.stream_max_length || '0-10000'}
                  inputProps={{ min: 0, max: 10000 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Skip Frames"
                  type="number"
                  value={formData.stream_skip_frames || ''}
                  onChange={(e) => handleInputChange('stream_skip_frames', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.stream_skip_frames}
                  helperText={errors.stream_skip_frames || '0-100'}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>

              {/* Actions */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    component={Link}
                    href={`/cameras/${camera.id}`}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      updateCameraMutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={updateCameraMutation.isPending}
                  >
                    {updateCameraMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {updateCameraMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to update camera. Please try again.
        </Alert>
      )}
    </Container>
  );
};

export default CameraEditPage; 