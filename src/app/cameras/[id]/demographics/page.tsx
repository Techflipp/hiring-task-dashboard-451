'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import Link from 'next/link';
import { useCamera, useDemographicsResults } from '@/hooks/useApi';
import { DemographicsFilters, Gender, Age, Emotion, EthnicGroup } from '@/types';
import { ChartSkeleton } from '@/components/Layout/LoadingSkeleton';

interface DemographicsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DemographicsPage: React.FC<DemographicsPageProps> = ({ params }) => {
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

  const { data: camera, isLoading: isLoadingCamera, error: cameraError } = useCamera(cameraId);
  
  const [filters, setFilters] = useState<DemographicsFilters>({
    camera_id: cameraId,
  });

  // Update filters when cameraId changes
  useEffect(() => {
    if (cameraId) {
      setFilters(prev => ({
        ...prev,
        camera_id: cameraId,
      }));
    }
  }, [cameraId]);

  const { data: demographicsData, isLoading: isLoadingData, error: dataError } = useDemographicsResults(filters);

  const handleFilterChange = (field: keyof DemographicsFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      camera_id: cameraId,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    key !== 'camera_id' && filters[key as keyof DemographicsFilters]
  );

  // Show loading while params are being loaded
  if (isLoadingParams) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <ChartSkeleton />
      </Container>
    );
  }

  if (cameraError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load camera details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (dataError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load demographics data. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (isLoadingCamera) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <ChartSkeleton />
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

  if (!camera.demographics_config) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="info">
          No demographics configuration found for this camera. Please create one first.
        </Alert>
      </Container>
    );
  }

  const analytics = demographicsData?.analytics;
  const results = demographicsData?.results || [];

  // Prepare data for charts
  const genderData = analytics ? Object.entries(analytics.gender_distribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  })) : [];

  const ageData = analytics ? Object.entries(analytics.age_distribution).map(([key, value]) => ({
    name: key,
    value,
  })) : [];

  const emotionData = analytics ? Object.entries(analytics.emotion_distribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  })) : [];

  const ethnicityData = analytics ? Object.entries(analytics.ethnicity_distribution).map(([key, value]) => ({
    name: key.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value,
  })) : [];

  const hourlyData = Object.entries(analytics?.hourly_distribution ?? {}).map(([hour, value]) => ({
    hour: `${hour}:00`,
    detections: value,
  }));

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          Cameras
        </MuiLink>
        <MuiLink component={Link} href={`/cameras/${camera.id}`} color="inherit">
          {camera.name}
        </MuiLink>
        <Typography color="text.primary">Demographics Analytics</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href={`/cameras/${camera.id}`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Camera
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Demographics Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {camera.name} - Analytics Dashboard
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FilterIcon />
            <Typography variant="h6">Filters</Typography>
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                variant="outlined"
              >
                Clear Filters
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender || ''}
                  label="Gender"
                  onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={Gender.MALE}>Male</MenuItem>
                  <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Age Group</InputLabel>
                <Select
                  value={filters.age || ''}
                  label="Age Group"
                  onChange={(e) => handleFilterChange('age', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={Age.ZERO_EIGHTEEN}>0-18</MenuItem>
                  <MenuItem value={Age.NINETEEN_THIRTY}>19-30</MenuItem>
                  <MenuItem value={Age.THIRTYONE_FORTYFIVE}>31-45</MenuItem>
                  <MenuItem value={Age.FORTYSIX_SIXTY}>46-60</MenuItem>
                  <MenuItem value={Age.SIXTYPLUS}>60+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Emotion</InputLabel>
                <Select
                  value={filters.emotion || ''}
                  label="Emotion"
                  onChange={(e) => handleFilterChange('emotion', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={Emotion.HAPPY}>Happy</MenuItem>
                  <MenuItem value={Emotion.SAD}>Sad</MenuItem>
                  <MenuItem value={Emotion.ANGRY}>Angry</MenuItem>
                  <MenuItem value={Emotion.FEAR}>Fear</MenuItem>
                  <MenuItem value={Emotion.SURPRISE}>Surprise</MenuItem>
                  <MenuItem value={Emotion.NEUTRAL}>Neutral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Ethnicity</InputLabel>
                <Select
                  value={filters.ethnicity || ''}
                  label="Ethnicity"
                  onChange={(e) => handleFilterChange('ethnicity', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={EthnicGroup.WHITE}>White</MenuItem>
                  <MenuItem value={EthnicGroup.AFRICAN}>African</MenuItem>
                  <MenuItem value={EthnicGroup.SOUTH_ASIAN}>South Asian</MenuItem>
                  <MenuItem value={EthnicGroup.EAST_ASIAN}>East Asian</MenuItem>
                  <MenuItem value={EthnicGroup.MIDDLE_EASTERN}>Middle Eastern</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Detections
                </Typography>
                <Typography variant="h4">
                  {(analytics?.total_detections ?? 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Most Common Gender
                </Typography>
                <Typography variant="h4">
                  {Object.entries(analytics.gender_distribution).reduce((a, b) => 
                    analytics.gender_distribution[a[0] as Gender] > analytics.gender_distribution[b[0] as Gender] ? a : b
                  )[0].charAt(0).toUpperCase()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Most Common Age
                </Typography>
                <Typography variant="h4">
                  {Object.entries(analytics.age_distribution).reduce((a, b) => 
                    analytics.age_distribution[a[0] as Age] > analytics.age_distribution[b[0] as Age] ? a : b
                  )[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Most Common Emotion
                </Typography>
                <Typography variant="h4">
                  {Object.entries(analytics.emotion_distribution).reduce((a, b) => 
                    analytics.emotion_distribution[a[0] as Emotion] > analytics.emotion_distribution[b[0] as Emotion] ? a : b
                  )[0].charAt(0).toUpperCase()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      {isLoadingData ? (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <ChartSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : analytics ? (
        <Grid container spacing={3}>
          {/* Gender Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gender Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Age Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Age Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Emotion Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emotion Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Ethnicity Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ethnicity Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ethnicityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Hourly Distribution */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hourly Detection Pattern
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="detections" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Results Table */}
      {results.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Detections
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Emotion</TableCell>
                    <TableCell>Ethnicity</TableCell>
                    <TableCell>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.slice(0, 20).map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {new Date(result.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.gender.charAt(0).toUpperCase() + result.gender.slice(1)} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.age} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1)} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.ethnicity.replace('_', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        {(result.confidence * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default DemographicsPage; 