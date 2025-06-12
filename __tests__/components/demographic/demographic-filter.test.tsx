import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsFilters } from '../../../components/demographics/filters';
import { DemographicsFilters as DemographicsFiltersType } from '../../../lib/types';

// Mock UI components
jest.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

jest.mock('../../../components/ui/input', () => ({
  Input: React.forwardRef(({ ...props }: any, ref: any) => (
    <input {...props} ref={ref} />
  )),
}));

jest.mock('../../../components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

jest.mock('../../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select 
      data-testid="select" 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div className={className} data-testid="select-trigger">{children}</div>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Filter: () => <div data-testid="filter-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

const mockInitialFilters: Partial<DemographicsFiltersType> = {
  gender: 'male',
  age: '19-30',
  emotion: 'happy'
};

describe('DemographicsFilters', () => {
  const defaultProps = {
    cameraId: 'camera-1',
    onFiltersChange: jest.fn(),
    initialFilters: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the filters component with all sections', () => {
      render(<DemographicsFilters {...defaultProps} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
      
      // Check all filter labels
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Age Group')).toBeInTheDocument();
      expect(screen.getByText('Emotion')).toBeInTheDocument();
      expect(screen.getByText('Ethnicity')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
    });

    it('shows key filter options', () => {
      render(<DemographicsFilters {...defaultProps} />);

      // Just verify some unique options exist without worrying about duplicates
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
      expect(screen.getByText('19-30 years')).toBeInTheDocument();
      expect(screen.getByText('Happy')).toBeInTheDocument();
      expect(screen.getByText('Sad')).toBeInTheDocument();
      expect(screen.getByText('White')).toBeInTheDocument();
      expect(screen.getByText('South Asian')).toBeInTheDocument();
    });

    it('shows clear all button when filters are active', () => {
      render(<DemographicsFilters {...defaultProps} initialFilters={mockInitialFilters} />);

      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('hides clear all button when no active filters', () => {
      render(<DemographicsFilters {...defaultProps} />);

      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  describe('Filter Updates', () => {
    it('calls onFiltersChange when gender filter is changed', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();
      
      render(<DemographicsFilters {...defaultProps} onFiltersChange={onFiltersChange} />);

      const genderSelect = screen.getAllByTestId('select')[0];
      await user.selectOptions(genderSelect, 'female');

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          camera_id: 'camera-1',
          gender: 'female'
        })
      );
    });

    it('clears filter when "All" option is selected', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();
      
      render(<DemographicsFilters {...defaultProps} onFiltersChange={onFiltersChange} initialFilters={mockInitialFilters} />);

      const genderSelect = screen.getAllByTestId('select')[0];
      await user.selectOptions(genderSelect, '__all__');

      // Gender should be removed from filters but other filters should remain
      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          camera_id: 'camera-1',
          age: '19-30',
          emotion: 'happy'
          // gender should not be present
        })
      );
    });

    it('updates date filters', () => {
      const onFiltersChange = jest.fn();
      render(<DemographicsFilters {...defaultProps} onFiltersChange={onFiltersChange} />);

      const dateInputs = screen.getAllByDisplayValue('');
      const startDateInput = dateInputs[0]; // Assuming first empty input is start date
      
      fireEvent.change(startDateInput, { target: { value: '2024-01-01T10:00' } });

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          camera_id: 'camera-1',
          start_date: '2024-01-01T10:00'
        })
      );
    });
  });

  describe('Clear All Functionality', () => {
    it('clears all filters when clear all button is clicked', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();
      
      render(<DemographicsFilters {...defaultProps} onFiltersChange={onFiltersChange} initialFilters={mockInitialFilters} />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(onFiltersChange).toHaveBeenCalledWith({
        camera_id: 'camera-1'
      });
    });

    it('preserves camera_id when clearing filters', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();
      
      render(<DemographicsFilters {...defaultProps} cameraId="test-camera" onFiltersChange={onFiltersChange} initialFilters={mockInitialFilters} />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(onFiltersChange).toHaveBeenCalledWith({
        camera_id: 'test-camera'
      });
    });
  });

  describe('Active Filters Display', () => {
    it('shows active filters summary when filters are applied', () => {
      const filters:Partial<DemographicsFiltersType> = {
        gender: 'female',
        age: '31-45',
        emotion: 'neutral',
        start_date: '2024-01-01T10:00'
      };
      
      render(<DemographicsFilters {...defaultProps} initialFilters={filters} />);

      expect(screen.getByText(/Active filters:/)).toBeInTheDocument();
      expect(screen.getByText(/Gender: female/)).toBeInTheDocument();
      expect(screen.getByText(/Age: 31-45/)).toBeInTheDocument();
      expect(screen.getByText(/Emotion: neutral/)).toBeInTheDocument();
      expect(screen.getByText(/Start Date: 2024-01-01T10:00/)).toBeInTheDocument();
    });

    it('does not show active filters section when no filters applied', () => {
      render(<DemographicsFilters {...defaultProps} />);

      expect(screen.queryByText(/Active filters:/)).not.toBeInTheDocument();
    });
  });

  describe('Filter State Management', () => {
    it('maintains camera_id in all filter updates', async () => {
      const user = userEvent.setup();
      const onFiltersChange = jest.fn();
      
      render(<DemographicsFilters {...defaultProps} cameraId="test-camera-123" onFiltersChange={onFiltersChange} />);

      const genderSelect = screen.getAllByTestId('select')[0];
      await user.selectOptions(genderSelect, 'male');

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          camera_id: 'test-camera-123'
        })
      );
    });

    it('populates form with initial filter values', () => {
      render(<DemographicsFilters {...defaultProps} initialFilters={mockInitialFilters} />);

      const selects = screen.getAllByTestId('select');
      expect(selects[0]).toHaveValue('male'); // Gender
      expect(selects[1]).toHaveValue('19-30'); // Age
      expect(selects[2]).toHaveValue('happy'); // Emotion
    });
  });

  describe('Edge Cases', () => {
    it('handles empty initial filters gracefully', () => {
      render(<DemographicsFilters {...defaultProps} initialFilters={{}} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('handles undefined initial filters', () => {
      render(<DemographicsFilters {...defaultProps} initialFilters={undefined} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('handles camera_id change', () => {
      const { rerender } = render(<DemographicsFilters {...defaultProps} cameraId="camera-1" />);
      
      rerender(<DemographicsFilters {...defaultProps} cameraId="camera-2" />);
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });
});