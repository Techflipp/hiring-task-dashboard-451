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
import { useCamera, useCreateDemographicsConfig, useUpdateDemographicsConfig } from '@/hooks/useApi';
import { DemographicsConfigFormData, DemographicsConfigFormErrors } from '@/types';
import { FormSkeleton } from '@/components/Layout/LoadingSkeleton';
import Grid from '@mui/material/Grid';

interface DemographicsConfigPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DemographicsConfigPage: React.FC<DemographicsConfigPageProps> = ({ params }) => {
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
  const createConfigMutation = useCreateDemographicsConfig();
  const updateConfigMutation = useUpdateDemographicsConfig();

  const [formData, setFormData] = useState<DemographicsConfigFormData>({
    track_history_max_length: undefined,
    exit_threshold: undefined,
    min_track_duration: undefined,
    detection_confidence_threshold: undefined,
    demographics_confidence_threshold: undefined,
    min_track_updates: undefined,
    box_area_threshold: undefined,
    save_interval: undefined,
    frame_skip_interval: undefined,
  });

  const [errors, setErrors] = useState<DemographicsConfigFormErrors>({});

  // Initialize form data when camera data is loaded
  useEffect(() => {
    if (camera?.demographics_config) {
      setFormData({
        track_history_max_length: camera.demographics_config.track_history_max_length,
        exit_threshold: camera.demographics_config.exit_threshold,
        min_track_duration: camera.demographics_config.min_track_duration,
        detection_confidence_threshold: camera.demographics_config.detection_confidence_threshold,
        demographics_confidence_threshold: camera.demographics_config.demographics_confidence_threshold,
        min_track_updates: camera.demographics_config.min_track_updates,
        box_area_threshold: camera.demographics_config.box_area_threshold,
        save_interval: camera.demographics_config.save_interval,
        frame_skip_interval: camera.demographics_config.frame_skip_interval,
      });
    }
  }, [camera]);

  const validateForm = (): boolean => {
    const newErrors: DemographicsConfigFormErrors = {};

    if (formData.track_history_max_length && (formData.track_history_max_length < 1 || formData.track_history_max_length > 100)) {
      newErrors.track_history_max_length = 'Track history max length must be between 1 and 100';
    }

    if (formData.exit_threshold && (formData.exit_threshold < 1 || formData.exit_threshold > 300)) {
      newErrors.exit_threshold = 'Exit threshold must be between 1 and 300';
    }

    if (formData.min_track_duration && (formData.min_track_duration < 1 || formData.min_track_duration > 60)) {
      newErrors.min_track_duration = 'Min track duration must be between 1 and 60';
    }

    if (formData.detection_confidence_threshold && (formData.detection_confidence_threshold < 0.1 || formData.detection_confidence_threshold > 1.0)) {
      newErrors.detection_confidence_threshold = 'Detection confidence threshold must be between 0.1 and 1.0';
    }

    if (formData.demographics_confidence_threshold && (formData.demographics_confidence_threshold < 0.1 || formData.demographics_confidence_threshold > 1.0)) {
      newErrors.demographics_confidence_threshold = 'Demographics confidence threshold must be between 0.1 and 1.0';
    }

    if (formData.min_track_updates && (formData.min_track_updates < 1 || formData.min_track_updates > 100)) {
      newErrors.min_track_updates = 'Min track updates must be between 1 and 100';
    }

    if (formData.box_area_threshold && (formData.box_area_threshold < 0.05 || formData.box_area_threshold > 1.0)) {
      newErrors.box_area_threshold = 'Box area threshold must be between 0.05 and 1.0';
    }

    if (formData.save_interval && (formData.save_interval < 300 || formData.save_interval > 1800)) {
      newErrors.save_interval = 'Save interval must be between 300 and 1800 seconds';
    }

    if (formData.frame_skip_interval && (formData.frame_skip_interval < 0.1 || formData.frame_skip_interval > 5.0)) {
      newErrors.frame_skip_interval = 'Frame skip interval must be between 0.1 and 5.0';
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
      if (camera?.demographics_config) {
        // Update existing config
        await updateConfigMutation.mutateAsync({
          configId: camera.demographics_config.id,
          data: formData,
        });
      } else {
        // Create new config
        await createConfigMutation.mutateAsync({
          camera_id: cameraId,
          ...formData,
        });
      }
      
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      console.error('Failed to save demographics config:', error);
    }
  };

  const handleInputChange = (field: keyof DemographicsConfigFormData, value: string | number | undefined) => {
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

  const isEditing = !!camera?.demographics_config;
  const isPending = createConfigMutation.isPending || updateConfigMutation.isPending;
  const hasError = createConfigMutation.error || updateConfigMutation.error;

  // Show loading while params are being loaded
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
        <Typography color="text.primary">
          {isEditing ? 'Edit Demographics Config' : 'Create Demographics Config'}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Edit Demographics Configuration' : 'Create Demographics Configuration'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure demographics detection parameters for {camera.name}
        </Typography>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Tracking Configuration */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Tracking Configuration
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Track History Max Length"
                  type="number"
                  value={formData.track_history_max_length || ''}
                  onChange={(e) => handleInputChange('track_history_max_length', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.track_history_max_length}
                  helperText={errors.track_history_max_length || '1-100'}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Exit Threshold"
                  type="number"
                  value={formData.exit_threshold || ''}
                  onChange={(e) => handleInputChange('exit_threshold', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.exit_threshold}
                  helperText={errors.exit_threshold || '1-300'}
                  inputProps={{ min: 1, max: 300 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Min Track Duration"
                  type="number"
                  value={formData.min_track_duration || ''}
                  onChange={(e) => handleInputChange('min_track_duration', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.min_track_duration}
                  helperText={errors.min_track_duration || '1-60 seconds'}
                  inputProps={{ min: 1, max: 60 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Min Track Updates"
                  type="number"
                  value={formData.min_track_updates || ''}
                  onChange={(e) => handleInputChange('min_track_updates', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.min_track_updates}
                  helperText={errors.min_track_updates || '1-100'}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>

              {/* Confidence Thresholds */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Confidence Thresholds
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Detection Confidence Threshold"
                  type="number"
                  value={formData.detection_confidence_threshold || ''}
                  onChange={(e) => handleInputChange('detection_confidence_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
                  error={!!errors.detection_confidence_threshold}
                  helperText={errors.detection_confidence_threshold || '0.1-1.0'}
                  inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Demographics Confidence Threshold"
                  type="number"
                  value={formData.demographics_confidence_threshold || ''}
                  onChange={(e) => handleInputChange('demographics_confidence_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
                  error={!!errors.demographics_confidence_threshold}
                  helperText={errors.demographics_confidence_threshold || '0.1-1.0'}
                  inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
                />
              </Grid>

              {/* Area and Timing */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Area and Timing Configuration
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Box Area Threshold"
                  type="number"
                  value={formData.box_area_threshold || ''}
                  onChange={(e) => handleInputChange('box_area_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
                  error={!!errors.box_area_threshold}
                  helperText={errors.box_area_threshold || '0.05-1.0'}
                  inputProps={{ min: 0.05, max: 1.0, step: 0.05 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Save Interval (seconds)"
                  type="number"
                  value={formData.save_interval || ''}
                  onChange={(e) => handleInputChange('save_interval', e.target.value ? parseInt(e.target.value) : undefined)}
                  error={!!errors.save_interval}
                  helperText={errors.save_interval || '300-1800 seconds'}
                  inputProps={{ min: 300, max: 1800 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Frame Skip Interval"
                  type="number"
                  value={formData.frame_skip_interval || ''}
                  onChange={(e) => handleInputChange('frame_skip_interval', e.target.value ? parseFloat(e.target.value) : undefined)}
                  error={!!errors.frame_skip_interval}
                  helperText={errors.frame_skip_interval || '0.1-5.0'}
                  inputProps={{ min: 0.1, max: 5.0, step: 0.1 }}
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
                      isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={isPending}
                  >
                    {isPending ? 'Saving...' : (isEditing ? 'Update Configuration' : 'Create Configuration')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {hasError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to save demographics configuration. Please try again.
        </Alert>
      )}
    </Container>
  );
};

export default DemographicsConfigPage; 