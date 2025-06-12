import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CameraList } from '../../../components/camera/camera-list';
import { Camera, PaginatedResponse } from '../../../lib/types';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock the CameraCard component
jest.mock('../../../components/camera/camera-card', () => ({
  CameraCard: ({ camera }: { camera: Camera }) => (
    <div data-testid={`camera-card-${camera.id}`}>
      <h3>{camera.name}</h3>
      <p>{camera.is_active ? 'Active' : 'Inactive'}</p>
    </div>
  )
}));

// Mock UI components
jest.mock('../../../components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => (
    <nav aria-label="Pagination" data-testid="pagination">{children}</nav>
  ),
  PaginationContent: ({ children }: { children: React.ReactNode }) => (
    <div className="pagination-content">{children}</div>
  ),
  PaginationItem: ({ children }: { children: React.ReactNode }) => (
    <div className="pagination-item">{children}</div>
  ),
  PaginationLink: ({ children, onClick, isActive, href, className }: any) => (
    <a 
      href={href}
      onClick={onClick}
      className={className}
      data-active={isActive}
      aria-disabled={className?.includes('pointer-events-none')}
      tabIndex={className?.includes('pointer-events-none') ? -1 : 0}
    >
      {children}
    </a>
  ),
  PaginationNext: ({ children, onClick, href, className }: any) => (
    <a 
      href={href}
      onClick={onClick}
      className={className}
      aria-disabled={className?.includes('pointer-events-none')}
      tabIndex={className?.includes('pointer-events-none') ? -1 : 0}
    >
      {children || 'Next'}
    </a>
  ),
  PaginationPrevious: ({ children, onClick, href, className }: any) => (
    <a 
      href={href}
      onClick={onClick}
      className={className}
      aria-disabled={className?.includes('pointer-events-none')}
      tabIndex={className?.includes('pointer-events-none') ? -1 : 0}
    >
      {children || 'Previous'}
    </a>
  ),
  PaginationEllipsis: () => <span>...</span>,
}));

jest.mock('../../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      role="combobox"
      data-testid="page-size-select"
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <span className={className} data-testid="select-trigger">{children}</span>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder || ''}</span>,
}));

jest.mock('../../../components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ChevronLeftIcon: () => <div data-testid="chevron-left" />,
  ChevronRightIcon: () => <div data-testid="chevron-right" />,
  MoreHorizontalIcon: () => <div data-testid="more-horizontal" />,
}));

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockCameras: Camera[] = [
  {
    id: 'camera-1',
    name: 'Camera 1',
    rtsp_url: 'rtsp://camera1.local:554/stream',
    is_active: true,
    status_message: 'Connected',
    tags: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'camera-2',
    name: 'Camera 2',
    rtsp_url: 'rtsp://camera2.local:554/stream',
    is_active: false,
    status_message: 'Disconnected',
    tags: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'camera-3',
    name: 'Camera 3',
    rtsp_url: 'rtsp://camera3.local:554/stream',
    is_active: true,
    status_message: 'Connected',
    tags: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockPaginatedResponse: PaginatedResponse<Camera> = {
  items: mockCameras,
  total: 25,
  page: 1,
  size: 10,
  pages: 3
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('CameraList', () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    onPageChange: jest.fn(),
    onSizeChange: jest.fn(),
    currentPage: 1,
    pageSize: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays skeleton loading when isLoading is true', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} isLoading={true} />
      );

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBe(6);
    });
  });

  describe('Error State', () => {
    it('displays error message when error exists', () => {
      const error = new Error('Failed to load cameras');
      
      renderWithQueryClient(
        <CameraList {...defaultProps} error={error} />
      );

      expect(screen.getByText('Error loading cameras: Failed to load cameras')).toBeInTheDocument();
    });

    it('does not display camera content when there is an error', () => {
      const error = new Error('Network error');
      
      renderWithQueryClient(
        <CameraList {...defaultProps} error={error} data={mockPaginatedResponse} />
      );

      expect(screen.queryByTestId('camera-card-camera-1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays "No cameras found" when data is empty', () => {
      const emptyData: PaginatedResponse<Camera> = {
        items: [],
        total: 0,
        page: 1,
        size: 10,
        pages: 0
      };

      renderWithQueryClient(
        <CameraList {...defaultProps} data={emptyData} />
      );

      expect(screen.getByText('No cameras found')).toBeInTheDocument();
    });

    it('displays "No cameras found" when data is undefined', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={undefined} />
      );

      expect(screen.getByText('No cameras found')).toBeInTheDocument();
    });
  });

  describe('Camera Display', () => {
    it('renders all cameras from the data', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} />
      );

      expect(screen.getByTestId('camera-card-camera-1')).toBeInTheDocument();
      expect(screen.getByTestId('camera-card-camera-2')).toBeInTheDocument();
      expect(screen.getByTestId('camera-card-camera-3')).toBeInTheDocument();
    });

    it('displays correct camera information', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} />
      );

      expect(screen.getByText('Camera 1')).toBeInTheDocument();
      expect(screen.getByText('Camera 2')).toBeInTheDocument();
      expect(screen.getByText('Camera 3')).toBeInTheDocument();
    });
  });

  describe('Pagination Info', () => {
    it('displays correct pagination information', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} />
      );

      // Component shows theoretical page range, not actual items on page
      expect(screen.getByText('Showing 1 to 10 of 25 cameras')).toBeInTheDocument();
    });

    it('calculates pagination info correctly for different pages', () => {
      const secondPageData = { ...mockPaginatedResponse, page: 2 };
      
      renderWithQueryClient(
        <CameraList {...defaultProps} data={secondPageData} currentPage={2} />
      );

      expect(screen.getByText('Showing 11 to 20 of 25 cameras')).toBeInTheDocument();
    });
  });

  describe('Page Size Selector', () => {
    it('displays page size selector with options', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} pageSize={20} />
      );

      // Check that the select element exists and has the correct value
      const select = screen.getByTestId('page-size-select');
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue('20');
      
      // Check that all options are available
      expect(screen.getByText('10 per page')).toBeInTheDocument();
      expect(screen.getByText('20 per page')).toBeInTheDocument();
      expect(screen.getByText('50 per page')).toBeInTheDocument();
    });

    it('calls onSizeChange when page size is changed', async () => {
      const user = userEvent.setup();
      const onSizeChange = jest.fn();
      
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} onSizeChange={onSizeChange} />
      );

      const select = screen.getByTestId('page-size-select');
      await user.selectOptions(select, '50');

      expect(onSizeChange).toHaveBeenCalledWith(50);
    });
  });

  describe('Basic Pagination', () => {
    it('displays pagination when there are multiple pages', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} />
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('hides pagination when there is only one page', () => {
      const singlePageData = { ...mockPaginatedResponse, pages: 1, total: 3 };
      
      renderWithQueryClient(
        <CameraList {...defaultProps} data={singlePageData} />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} currentPage={1} />
      );

      const previousButton = screen.getByText('Previous');
      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables next button on last page', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} currentPage={3} />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('calls onPageChange when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} onPageChange={onPageChange} currentPage={1} />
      );

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when previous button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} onPageChange={onPageChange} currentPage={2} />
      );

      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Basic Accessibility', () => {
    it('has proper pagination aria labels', () => {
      renderWithQueryClient(
        <CameraList {...defaultProps} data={mockPaginatedResponse} />
      );

      expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    });
  });
});