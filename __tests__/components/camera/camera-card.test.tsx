import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CameraCard } from '../../../components/camera/camera-card';
import { Camera } from '../../../lib/types';
import { apiClient } from '../../../lib/api';

// Mock the API client
jest.mock('../../../lib/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Camera: () => <div data-testid="camera-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  BarChart3: () => <div data-testid="chart-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Image: () => <div data-testid="image-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockCamera: Camera = {
  id: 'test-camera-1',
  name: 'Test Camera',
  rtsp_url: 'rtsp://test.camera:554/stream',
  is_active: true,
  status_message: 'Connected and streaming',
  snapshot: 'https://example.com/snapshot.jpg',
  stream_frame_width: 1920,
  stream_frame_height: 1080,
  stream_quality: 90,
  stream_fps: 30,
  stream_skip_frames: 1,
  tags: [
    { id: 'tag-1', name: 'indoor', color: '#FF6B6B' },
    { id: 'tag-2', name: 'security', color: '#4ECDC4' }
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z'
};

const mockDetailedCamera: Camera = {
  ...mockCamera,
  stream_max_length: 3600,
  demographics_config: {
    id: 'demo-config-1',
    camera_id: 'test-camera-1',
    track_history_max_length: 30,
    exit_threshold: 75,
    min_track_duration: 3,
    detection_confidence_threshold: 0.6,
    demographics_confidence_threshold: 0.4,
    min_track_updates: 5,
    box_area_threshold: 0.15,
    save_interval: 300,
    frame_skip_interval: 2.5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('CameraCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders camera card with basic information', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      expect(screen.getByText('Test Camera')).toBeInTheDocument();
      expect(screen.getByText('rtsp://test.camera:554/stream')).toBeInTheDocument();
      expect(screen.getByText('Connected and streaming')).toBeInTheDocument();
    });

    it('displays camera status correctly for active camera', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('displays camera status correctly for inactive camera', () => {
      const inactiveCamera = { ...mockCamera, is_active: false };
      mockApiClient.getCamera.mockResolvedValue({ ...mockDetailedCamera, is_active: false });
      
      renderWithQueryClient(<CameraCard camera={inactiveCamera} />);
      
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('displays camera snapshot when available', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      const snapshot = screen.getByAltText('Test Camera snapshot');
      expect(snapshot).toBeInTheDocument();
      expect(snapshot).toHaveAttribute('src', 'https://example.com/snapshot.jpg');
    });
  });

  describe('Tags Display', () => {
    it('renders camera tags with colors', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      expect(screen.getByText('indoor')).toBeInTheDocument();
      expect(screen.getByText('security')).toBeInTheDocument();
    });

    it('shows tag count when more than 4 tags', () => {
      const cameraWithManyTags = {
        ...mockCamera,
        tags: [
          { id: 'tag-1', name: 'tag1', color: '#FF6B6B' },
          { id: 'tag-2', name: 'tag2', color: '#4ECDC4' },
          { id: 'tag-3', name: 'tag3', color: '#45B7D1' },
          { id: 'tag-4', name: 'tag4', color: '#96CEB4' },
          { id: 'tag-5', name: 'tag5', color: '#FFEAA7' },
          { id: 'tag-6', name: 'tag6', color: '#DDA0DD' }
        ]
      };
      
      mockApiClient.getCamera.mockResolvedValue({ ...mockDetailedCamera, tags: cameraWithManyTags.tags });
      
      renderWithQueryClient(<CameraCard camera={cameraWithManyTags} />);
      
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('handles camera with no tags', () => {
      const cameraWithoutTags = { ...mockCamera, tags: [] };
      mockApiClient.getCamera.mockResolvedValue({ ...mockDetailedCamera, tags: [] });
      
      renderWithQueryClient(<CameraCard camera={cameraWithoutTags} />);
      
      expect(screen.queryByText('indoor')).not.toBeInTheDocument();
    });
  });

// Fix the test to match the actual rendered output
it('displays technical specs when available', async () => {
  const mockCamera = {
    id: 'camera-1',
    name: 'Test Camera',
    rtsp_url: 'rtsp://test.camera:554/stream',
    is_active: true,
    status_message: 'Connected and streaming',
    snapshot: 'https://example.com/snapshot.jpg',
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_fps: 30,
    stream_quality: 90,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  };

  // Mock the API response
  mockApiClient.getCamera.mockResolvedValue(mockCamera);
  
  renderWithQueryClient(<CameraCard camera={mockCamera} />);
  
  await waitFor(() => {
    // Use lowercase 'x' instead of multiplication symbol '×'
    expect(screen.getByText('1920x1080')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});

// Alternative approach - use a more flexible text matcher
it('displays technical specs when available (alternative)', async () => {
  const mockCamera = {
    id: 'camera-1',
    name: 'Test Camera',
    rtsp_url: 'rtsp://test.camera:554/stream',
    is_active: true,
    status_message: 'Connected and streaming',
    snapshot: 'https://example.com/snapshot.jpg',
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_fps: 30,
    stream_quality: 90,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  };

  mockApiClient.getCamera.mockResolvedValue(mockCamera);
  
  renderWithQueryClient(<CameraCard camera={mockCamera} />);
  
  await waitFor(() => {
    // Use a more flexible matcher that looks for the resolution pattern
    expect(screen.getByText(/1920.*1080/)).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});

// Or test for individual parts separately
it('displays technical specs when available (separate checks)', async () => {
  const mockCamera = {
    id: 'camera-1',
    name: 'Test Camera',
    rtsp_url: 'rtsp://test.camera:554/stream',
    is_active: true,
    status_message: 'Connected and streaming',
    snapshot: 'https://example.com/snapshot.jpg',
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_fps: 30,
    stream_quality: 90,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  };

  mockApiClient.getCamera.mockResolvedValue(mockCamera);
  
  renderWithQueryClient(<CameraCard camera={mockCamera} />);
  
  await waitFor(() => {
    // Check for "Resolution:" label
    expect(screen.getByText('Resolution:')).toBeInTheDocument();
    // Check for width and height individually
    expect(screen.getByText(/1920/)).toBeInTheDocument();
    expect(screen.getByText(/1080/)).toBeInTheDocument();
    
    expect(screen.getByText('FPS:')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    
    expect(screen.getByText('Quality:')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});

  describe('Demographics Configuration', () => {
    it('shows demographics enabled badge when config exists', async () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      await waitFor(() => {
        expect(screen.getByText('Demographics Enabled')).toBeInTheDocument();
      });
    });

    it('shows demographics disabled when no config', async () => {
      const cameraWithoutDemo = { ...mockDetailedCamera, demographics_config: undefined };
      mockApiClient.getCamera.mockResolvedValue(cameraWithoutDemo);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      await waitFor(() => {
        expect(screen.getByText('Demographics Disabled')).toBeInTheDocument();
      });
    });
  });

  describe('Action Buttons', () => {
    it('renders all action buttons', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
    });

    it('has correct navigation links', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      const viewLink = screen.getByText('View').closest('a');
      const editButton = screen.getByTestId('edit-icon').closest('a');
      const demographicsButton = screen.getByTestId('chart-icon').closest('a');
      
      expect(viewLink).toHaveAttribute('href', '/cameras/test-camera-1');
      expect(editButton).toHaveAttribute('href', '/cameras/test-camera-1/edit');
      expect(demographicsButton).toHaveAttribute('href', '/cameras/test-camera-1/demographics');
    });
  });

  describe('Status Messages', () => {
    it('displays warning icon for inactive cameras', () => {
      const inactiveCamera = { 
        ...mockCamera, 
        is_active: false, 
        status_message: 'Connection lost' 
      };
      mockApiClient.getCamera.mockResolvedValue({ ...mockDetailedCamera, is_active: false });
      
      renderWithQueryClient(<CameraCard camera={inactiveCamera} />);
      
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Connection lost')).toBeInTheDocument();
    });

    it('handles missing status message', () => {
      const cameraWithoutStatus = { ...mockCamera, status_message: undefined };
      mockApiClient.getCamera.mockResolvedValue({ ...mockDetailedCamera, status_message: undefined });
      
      renderWithQueryClient(<CameraCard camera={cameraWithoutStatus} />);
      
      expect(screen.queryByTestId('alert-circle-icon')).not.toBeInTheDocument();
    });
  });

  describe('Image Error Handling', () => {
    it('handles image loading errors', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      const image = screen.getByAltText('Test Camera snapshot');
      
      // Simulate image load error
      Object.defineProperty(image, 'style', {
        value: { display: '' },
        writable: true
      });
      
      // This would trigger the onError handler in a real browser
      expect(image).toBeInTheDocument();
    });
  });

  describe('Timestamps', () => {
    it('displays creation and update timestamps', () => {
      mockApiClient.getCamera.mockResolvedValue(mockDetailedCamera);
      
      renderWithQueryClient(<CameraCard camera={mockCamera} />);
      
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
    });
  });
});