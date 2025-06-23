import { render, screen, fireEvent } from '@testing-library/react';
import CamerasPage from '../page';
import { useCameras } from '@/hooks/use-cameras';

// Mock the hooks
jest.mock('@/hooks/use-cameras');

describe('CamerasPage', () => {
  const mockCameras = {
    items: [
      {
        id: '1',
        name: 'Camera 1',
        rtsp_url: 'rtsp://example.com/camera1',
        demographics_config: null,
      },
      {
        id: '2',
        name: 'Camera 2',
        rtsp_url: 'rtsp://example.com/camera2',
        demographics_config: {
          id: 'config1',
          camera_id: '2',
        },
      },
    ],
    total: 2,
    page: 1,
    size: 10,
    pages: 1,
  };

  beforeEach(() => {
    (useCameras as jest.Mock).mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
    });
  });

  it('renders camera list', () => {
    render(<CamerasPage />);
    
    expect(screen.getByText('Cameras')).toBeInTheDocument();
    expect(screen.getByText('Camera 1')).toBeInTheDocument();
    expect(screen.getByText('Camera 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useCameras as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<CamerasPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useCameras as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load cameras'),
    });

    render(<CamerasPage />);
    expect(screen.getByText('Error loading cameras')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(<CamerasPage />);
    
    const searchInput = screen.getByPlaceholderText('Search cameras...');
    fireEvent.change(searchInput, { target: { value: 'Camera 1' } });
    
    expect(useCameras).toHaveBeenCalledWith(1, 10, 'Camera 1');
  });

  it('handles page size change', () => {
    render(<CamerasPage />);
    
    const sizeSelect = screen.getByRole('combobox');
    fireEvent.change(sizeSelect, { target: { value: '20' } });
    
    expect(useCameras).toHaveBeenCalledWith(1, 20, '');
  });
}); 